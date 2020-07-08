import {
  useState, useEffect, useRef,
} from 'react';
import {
  FieldValue,
  UseFieldProps,
  UseFieldValues,
  FieldState,
  FieldValidationObject,
  FieldAsyncValidationObject,
  fieldDefaultProps,
} from './types/field.types';
import { FormFields } from './types/form.types';
import { StepState } from './types/step.types';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';
import { getFieldUniqueId, useRefValue, getFieldHtmlUniqueId } from './utils';
import { useFormContext, defaultFormState } from './Formiz';
import { useStepContext } from './FormizStep';

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
  asyncValidations = fieldDefaultProps.asyncValidations,
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
    id: getFieldUniqueId(),
    resetKey: 0,
    value: initValue,
    valueDebounced: initValue,
    errors: [],
    asyncErrors: [],
    externalErrors: [],
    isValidating: false,
    isPristine: true,
    isEnabled: true,
  });
  const stateRef = useRefValue(state);
  const nameRef = useRefValue(name);
  const stepNameRef = useRefValue(stepName);
  const validationsRef = useRefValue(getValidationsWithRequired(validations || [], required));
  const asyncValidationsRef = useRefValue(asyncValidations || []);
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
  useEffect(() => {
    const subscription = subjects.onFormUpdate
      .subscription
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to external updates
  useEffect(() => {
    const subscription = subjects.onExternalFieldsUpdate
      .subscription
      .subscribe((fields: FormFields) => {
        const field = fields.find((x) => x.id === stateRef.current.id);
        if (field && JSON.stringify(field) !== JSON.stringify(stateRef.current)) {
          setState(field);
        }
      });
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to reset
  useEffect(() => {
    const subscription = subjects.onReset
      .subscription
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
      /**
       * Sync validations
       */

      const fieldErrors = (validationsRef.current || [])
        .reduce(
          (errors: any, validation: FieldValidationObject) => (!validation.rule(state.value)
            ? [...errors, validation.message]
            : errors),
          [],
        );

      const shouldRunAsyncValidations = (
        !fieldErrors.length
        && !!(asyncValidationsRef.current || []).length
      );

      setState((prevState: FieldState) => ({
        ...prevState,
        errors: fieldErrors,
        asyncErrors: [],
        valueDebounced: prevState.value,
        isValidating: shouldRunAsyncValidations,
      }));

      if (!shouldRunAsyncValidations) {
        return;
      }

      /**
       * Async validations
       */

      const rules = await Promise.all((asyncValidationsRef.current || [])
        .map(async (validation: FieldAsyncValidationObject) => {
          const isValid = await validation.rule(state.value);
          return {
            ...validation,
            isValid,
          };
        }));

      if (
        !isMountedRef.current
        || state.value !== stateRef.current.value
      ) {
        return;
      }

      const fieldAsyncErrors: (string | undefined)[] = rules
        .reduce(
          (errors: (string | undefined)[], validation: any) => (!validation.isValid
            ? [...errors, validation.message]
            : errors),
          [],
        );

      setState((prevState: FieldState) => ({
        ...prevState,
        asyncErrors: fieldAsyncErrors,
        isValidating: false,
      }));
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
    JSON.stringify(
      [
        ...(validations || []),
        ...(asyncValidations || []),
      ]?.reduce<any>(
        (acc, cur) => [
          ...acc,
          ...(cur.deps || []),
          cur.message,
        ],
        [],
      ),
    ),
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

  const allErrors = [...state.externalErrors, ...state.asyncErrors, ...state.errors];

  return {
    errorMessage: allErrors[0],
    errorMessages: allErrors,
    id: getFieldHtmlUniqueId(formStateRef?.current?.id || '', name),
    isPristine: state.isPristine,
    isSubmitted,
    isValid: !allErrors.length,
    isValidating: state.isValidating,
    setValue,
    value: state.value,
    valueDebounced: state.valueDebounced,
    resetKey: state.resetKey,
  };
};
