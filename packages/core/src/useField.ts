import {
  useState, useEffect, useRef, useLayoutEffect,
} from 'react';
import {
  FieldValue, FieldValidationObject, UseFieldProps, UseFieldValues, FieldState,
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

const getIsValidationsWithRequired = (
  validations: Array<FieldValidationObject>,
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
  debounce = 100, // TODO rename to debounceValidations
  defaultValue = null,
  formatValue = (value: FieldValue): FieldValue => value,
  name,
  onChange = () => {},
  required,
  validations = [],
  keepValue = false,
}: UseFieldProps): UseFieldValues => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const {
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

  const [formState, setFormState] = useState(defaultFormState);
  const initValue = keepValuesRef.current?.[name] ?? defaultValue;
  const [state, setState] = useState<FieldState>({
    id: getUniqueId('field'),
    resetKey: 0,
    value: initValue,
    valueDebounced: initValue,
    errors: [],
    isPristine: true,
    isEnabled: true,
  });
  const stateRef = useRefValue(state);
  const nameRef = useRefValue(name);
  const stepNameRef = useRefValue(stepName);
  const validationsRef = useRefValue(getIsValidationsWithRequired(validations, required));
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

  // Update validations
  useEffect(() => {
    const validateField = async () => {
      const errors = await getFieldErrors(state.value, validationsRef.current);
      if (isMountedRef.current) {
        setState((prevState: FieldState) => ((
          JSON.stringify(prevState.errors) === JSON.stringify(errors)
        )
          ? {
            ...prevState,
            valueDebounced: prevState.value,
          }
          : {
            ...prevState,
            errors,
            valueDebounced: prevState.value,
          }));
      }
    };

    if (!debounce) {
      validateField();
      return () => {};
    }

    const timer = setTimeout(() => {
      validateField();
    }, debounce);
    return () => clearTimeout(timer);
  }, [
    JSON.stringify(state.value),
    JSON.stringify(validations.reduce<any>(
      (acc, cur) => [
        ...acc,
        ...(cur.deps || []),
        cur.message,
      ],
      [],
    )),
  ]);

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

  return {
    errorMessage: state.errors[0],
    errorMessages: state.errors,
    id: state.id,
    isPristine: state.isPristine,
    isSubmitted,
    isValid: !state.errors.length,
    setValue,
    value: state.value,
    valueDebounced: state.valueDebounced,
    resetKey: state.resetKey,
  };
};
