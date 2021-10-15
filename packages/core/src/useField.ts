import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import get from 'lodash/get';
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
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';
import {
  getFieldUniqueId, useRefValue, getExposedField,
} from './utils';
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
  ...otherProps
}: UseFieldProps): UseFieldValues => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const {
    formStateRef,
    actions,
    subjects,
    keepValuesRef,
    fromSetFieldsValuesRef,
    initialValuesRef,
  } = useFormContext();

  if (!subjects || !actions || !keepValuesRef) {
    throw ErrorFieldWithoutForm;
  }

  const isMountedRef = useRef(true);
  const subjectsRef = useRefValue(subjects);
  const actionsRef = useRefValue(actions);
  const stepContext = useStepContext();
  const stepName = stepContext?.name;

  const [formState, setFormState] = useState(formStateRef?.current ?? defaultFormState);
  const initValue = (() => {
    if (get(fromSetFieldsValuesRef?.current, name) !== undefined) {
      return get(fromSetFieldsValuesRef?.current, name);
    }
    if (keepValuesRef.current?.[name] !== undefined) {
      return keepValuesRef.current?.[name];
    }
    return get(initialValuesRef?.current, name) ?? defaultValue;
  })();
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
  const validationsWithRequired = getValidationsWithRequired(validations || [], required);
  const stateRef = useRefValue(state);
  const nameRef = useRefValue(name);
  const stepNameRef = useRefValue(stepName);
  const validationsRef = useRefValue(validationsWithRequired);
  const asyncValidationsRef = useRefValue(asyncValidations || []);
  const debounceRef = useRefValue(debounce);
  const onChangeRef = useRefValue(onChange);
  const formatValueRef = useRefValue(formatValue);
  const defaultValueRef = useRefValue(defaultValue);
  const keepValueRef = useRefValue(keepValue);

  const setValue = useCallback(
    (value: FieldValue | ((prevValue: FieldValue) => FieldValue)) => {
      setState((prevState: FieldState) => {
        const computedValue = typeof value === 'function' ? value(prevState.value) : value;
        onChangeRef.current(formatValueRef.current(computedValue), computedValue);
        return ({
          ...prevState,
          externalErrors: [],
          value: computedValue,
          isPristine: false,
        });
      });
    },
    [onChangeRef, formatValueRef],
  );

  // Subscribe to form state
  useEffect(() => {
    const subscription = subjectsRef.current.onFormUpdate
      .subscription
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, [subjectsRef]);

  // Subscribe to external updates
  useEffect(() => {
    const subscription = subjectsRef.current.onExternalFieldsUpdate
      .subscription
      .subscribe((fields: FormFields) => {
        const field = fields.find((x) => x.id === stateRef.current.id);
        if (field && JSON.stringify(field) !== JSON.stringify(stateRef.current)) {
          setState(field);
        }
      });
    return () => subscription.unsubscribe();
  }, [subjectsRef, stateRef]);

  // Subscribe to reset
  useEffect(() => {
    const subscription = subjectsRef.current.onReset
      .subscription
      .subscribe(() => {
        const value = get(initialValuesRef?.current, nameRef.current) ?? defaultValueRef.current;

        setState((prevState) => ({
          ...prevState,
          externalErrors: [],
          resetKey: prevState.resetKey + 1,
          isPristine: true,
          isValidating: false,
          value,
        }));

        onChangeRef.current(
          formatValueRef.current(value),
          value,
        );

        if (actionsRef.current?.removeFromInitialValues) {
          actionsRef.current.removeFromInitialValues(nameRef.current);
        }
      });
    return () => subscription.unsubscribe();
  }, [
    subjectsRef,
    initialValuesRef,
    defaultValueRef,
    nameRef,
    onChangeRef,
    formatValueRef,
    actionsRef,
  ]);

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
  },
  /* eslint-disable react-hooks/exhaustive-deps */
  [
    JSON.stringify(state.value),
    JSON.stringify(
      [
        ...(validationsWithRequired),
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
    asyncValidationsRef,
    debounceRef,
    stateRef,
    validationsRef,
  ]);
  /* eslint-enable */

  // Register / Unregister the field
  useEffect(() => {
    actionsRef.current.registerField({
      ...stateRef.current,
      name: nameRef.current,
      stepName: stepNameRef.current,
      value: formatValueRef.current(stateRef.current.value),
    });

    return () => {
      /* eslint-disable react-hooks/exhaustive-deps */
      actionsRef.current.unregisterField(
        {
          ...stateRef.current,
          name: nameRef.current,
          stepName: stepNameRef.current,
          value: formatValueRef.current(stateRef.current.value),
        },
        keepValueRef.current,
      );
      /* eslint-enable */
    };
  }, [actionsRef, stateRef, nameRef, stepNameRef, formatValueRef, keepValueRef]);

  // Update field at form level
  useEffect(() => {
    actionsRef.current.updateField({
      ...state,
      name,
      stepName,
      value: formatValueRef.current(state.value),
    });
  },
  /* eslint-disable react-hooks/exhaustive-deps */
  [
    name,
    stepName,
    JSON.stringify(state),
    actionsRef,
    formatValueRef,
  ]);
  /* eslint-enable */

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  return {
    setValue,
    otherProps,
    ...getExposedField({
      ...state,
      name,
      stepName,
    }, formState),
  };
};
