import {
  useState, useEffect, useRef, useLayoutEffect,
} from 'react';
import {
  FieldValue, FieldValidationObject, UseFieldProps, UseFieldValues, FieldState, fieldDefaultProps,
} from './types/field.types';
import { FormFields } from './types/form.types';
import { StepState } from './types/step.types';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';
import { getUniqueId, useRefValue } from './utils';
import { useFormContext, defaultFormState } from './Formiz';
import { useStepContext } from './FormizStep';

// TODO: don't use Promise.all()
const getFieldErrors = async (
  value: FieldValue,
  validations: FieldValidationObject[],
): Promise<(string | undefined)[]> => {
  const rules = await Promise.all((validations || [])
    .map(async (validation) => validation.rule(value)));
  return rules
    .reduce<(string | undefined)[]>(
      (errors, isValid, index) => (!isValid ? [...errors, validations[index].message] : errors),
    []);
};

const getValidationsWithRequired = (
  validations: FieldValidationObject[],
  required?: boolean | string,
) => {
  if (!required && required !== '') {
    return validations;
  }
  return [
    ...validations,
    {
      rule: (x: FieldValue) => !!x || x === 0,
      message: required !== true ? required : '',
    }];
};

export const useField = ({
  name,
  debounce = fieldDefaultProps.debounce,
  defaultValue = fieldDefaultProps.defaultValue,
  formatValue = fieldDefaultProps.formatValue,
  onChange = fieldDefaultProps.onChange,
  required = fieldDefaultProps.required,
  validations = fieldDefaultProps.validations,
  keepValue = fieldDefaultProps.keepValue,
}: UseFieldProps): UseFieldValues => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const {
    formStateRef,
    actions,
    subjects,
    keepValuesRef,
  } = useFormContext();

  if (!subjects || !actions || !keepValuesRef) {
    throw ErrorFieldWithoutForm;
  }

  const isMountedRef = useRef(true);
  const stepContext = useStepContext();
  const stepName = stepContext?.name;

  const [formState, setFormState] = useState(formStateRef?.current ?? defaultFormState);
  const initValue = keepValuesRef.current?.[name] ?? defaultValue;
  const [state, setState] = useState<FieldState>({
    id: getUniqueId('field'),
    resetKey: 0,
    value: initValue,
    valueDebounced: initValue,
    errors: [],
    externalErrors: [],
    isPristine: true,
    isEnabled: true,
  });
  const stateRef = useRefValue(state);
  const nameRef = useRefValue(name);
  const stepNameRef = useRefValue(stepName);
  const validationsRef = useRefValue(getValidationsWithRequired(validations || [], required));
  const debounceRef = useRefValue(debounce);
  const onChangeRef = useRefValue(onChange);
  const formatValueRef = useRefValue(formatValue);
  const defaultValueRef = useRefValue(defaultValue);
  const keepValueRef = useRefValue(keepValue);
  const currentStepName = formState.navigatedStepName
    || formState.initialStepName;
  const currentStep: (StepState | null) = formState.steps
    .find((x) => x.name === currentStepName) || null;

  const setValue = (value: FieldValue) => {
    setState((prevState: FieldState) => ({
      ...prevState,
      externalErrors: [],
      value,
      isPristine: false,
    }));
    onChangeRef.current(formatValueRef.current(value), value);
  };

  // Subscribe to form state
  useLayoutEffect(() => {
    const subscription = subjects.onFormUpdate
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to external updates
  useLayoutEffect(() => {
    const subscription = subjects.onExternalFieldsUpdate
      .subscribe((fields: FormFields) => {
        const field = fields.find((x) => x.id === stateRef.current.id);
        if (field && JSON.stringify(field) !== JSON.stringify(stateRef.current)) {
          setState(field);
        }
      });
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to reset
  useLayoutEffect(() => {
    const subscription = subjects.onReset
      .subscribe(() => {
        setState((prevState) => ({
          ...prevState,
          error: [],
          externalErrors: [],
          resetKey: prevState.resetKey + 1,
          isPristine: true,
          value: defaultValueRef.current,
        }));
        onChangeRef.current(
          formatValueRef.current(defaultValueRef.current),
          defaultValueRef.current,
        );
      });
    return () => subscription.unsubscribe();
  }, []);


  // Update validations
  useEffect(() => {
    const validateField = async () => {
      const errors = await getFieldErrors(state.value, validationsRef.current);
      if (isMountedRef.current) {
        setState((prevState: FieldState) => ({
          ...prevState,
          errors,
          valueDebounced: prevState.value,
        }));
      }
    };

    if (!debounceRef.current) {
      validateField();
      return () => {};
    }

    const timer = setTimeout(() => {
      validateField();
    }, debounceRef.current);
    return () => clearTimeout(timer);
  }, [
    JSON.stringify(state.value),
    JSON.stringify(validations?.reduce<any>(
      (acc, cur) => [
        ...acc,
        ...(cur.deps || []),
        cur.message,
      ],
      [],
    )),
  ]);

  // Register / Unregister the field
  useEffect(() => {
    actions.registerField({
      ...stateRef.current,
      name: nameRef.current,
      stepName: stepNameRef.current,
      value: formatValueRef.current(stateRef.current.value),
    });

    return () => {
      actions.unregisterField(
        {
          ...stateRef.current,
          name: nameRef.current,
          stepName: stepNameRef.current,
          value: formatValueRef.current(stateRef.current.value),
        },
        keepValueRef.current,
      );
    };
  }, []);

  // Update field at form level
  useEffect(() => {
    actions.updateField({
      ...state,
      name,
      stepName,
      value: formatValueRef.current(state.value),
    });
  }, [name, stepName, JSON.stringify(state)]);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  const isSubmitted = stepName && currentStep && currentStepName === stepName
    ? currentStep.isSubmitted
    : formState.isSubmitted;

  const allErrors = [...state.externalErrors, ...state.errors];

  return {
    errorMessage: allErrors[0],
    errorMessages: allErrors,
    id: state.id,
    isPristine: state.isPristine,
    isSubmitted,
    isValid: !allErrors.length,
    setValue,
    value: state.value,
    valueDebounced: state.valueDebounced,
    resetKey: state.resetKey,
  };
};
