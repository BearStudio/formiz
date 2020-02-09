import {
  useEffect, useState, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import memoized from 'fast-memoize';
import { useFormContext } from '../FormContext';
import { getStep, getUniqueId } from '../FormContext/helpers';
import {
  fieldRegister, fieldUnregister, fieldUpdateValidations, fieldSetValue,
} from '../FormContext/actions';
import { useFormStepName } from '../FormStepContext';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

const DEFAULT_FIELD_DEBOUNCE = 100;

export const fieldPropTypes = {
  debounce: PropTypes.number,
  defaultValue: PropTypes.any,
  formatValue: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  keepValue: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  validations: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.func,
    message: PropTypes.node,
  })),
};

export const fieldDefaultProps = {
  debounce: DEFAULT_FIELD_DEBOUNCE,
  defaultValue: null,
  formatValue: (val) => val,
  required: false,
  keepValue: false,
  onChange: () => {},
  validations: [],
};

const getIsRequiredValidation = (required) => {
  if (!required && required !== '') {
    return {};
  }
  return {
    rule: (x) => !!x || x === 0,
    message: required !== true ? required : '',
  };
};

const getValidations = (required, validations) => {
  const extraRules = [
    getIsRequiredValidation(required),
  ];

  return [
    ...extraRules,
    ...validations,
  ]
    .filter((x) => x.rule)
    .map((x) => ({ ...x, rule: memoized(x.rule) }));
};

export const useField = ({
  debounce = DEFAULT_FIELD_DEBOUNCE,
  defaultValue,
  formatValue = (val) => val,
  required,
  keepValue,
  name,
  onChange,
  validations = [],
}) => {
  const fieldId = useMemo(() => getUniqueId('field'), []);

  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();
  const stepName = useFormStepName();

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;
  const field = state.fields.find((f) => f.id === fieldId) || {};
  const errorMessages = (field.errors || []).filter((x) => !!x);
  const currentStep = getStep(stepName, state.steps);
  const isSubmitted = currentStep.name ? currentStep.isSubmitted : state.isSubmitted;
  const [localValue, setLocalValue] = useState(field.value || defaultValue);

  const debounceRef = useRef(debounce);
  debounceRef.current = debounce;

  const defaultValueRef = useRef();
  defaultValueRef.current = defaultValue;

  const localValueRef = useRef();
  localValueRef.current = localValue;

  const keepValueRef = useRef();
  keepValueRef.current = keepValue;

  const formatValueRef = useRef();
  formatValueRef.current = formatValue;

  const isFirstRenderRef = useRef(true);

  // Mount & Unmount field
  useEffect(() => {
    dispatch(fieldRegister(
      fieldId,
      name,
      {
        value: localValueRef.current,
        step: stepName,
        validations: getValidations(required, validations),
      },
    ));

    return () => {
      dispatch(fieldUnregister(fieldId, keepValueRef.current));
    };
  }, [
    fieldId,
    name,
    stepName,
  ]);

  // Reset value if resetKey change
  useEffect(() => {
    if (!keepValueRef.current) {
      setLocalValue(defaultValueRef.current);
    }
  }, [state.resetKey]);

  // Update localValue if global value change
  useEffect(() => {
    if (
      field.value !== undefined // Initial state
      && JSON.stringify(field.value) !== JSON.stringify(localValueRef.current)
    ) {
      setLocalValue(field.value);
    }
  }, [JSON.stringify(field.value)]);

  // Update state value from local value
  useEffect(() => {
    if (isFirstRenderRef.current) {
      return () => {};
    }

    const formattedValue = formatValueRef.current(localValue);

    if (!debounceRef.current) {
      dispatch(fieldSetValue(fieldId, formattedValue));
      return () => {};
    }

    const timer = setTimeout(() => {
      dispatch(fieldSetValue(fieldId, formattedValue));
    }, debounceRef.current);

    return () => {
      clearTimeout(timer);
    };
  }, [JSON.stringify(localValue), fieldId]);

  // Update Validations
  useEffect(() => {
    if (!isFirstRenderRef.current) {
      dispatch(fieldUpdateValidations(fieldId, getValidations(required, validations)));
    }
  }, [
    fieldId,
    required,
    JSON.stringify(...validations.reduce(
      // use deps array and message as dependencies for updating validations
      (acc, cur) => [...acc, ...(cur.deps || []), cur.message],
      [],
    )),
  ]);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  return {
    id: fieldId,
    resetKey: state.resetKey,
    value: localValue || '',
    valueDebounced: field.value || defaultValue || '',
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field.errors ? !field.errors.length : true,
    isPristine: !!field.isPristine,
    isSubmitted,
    setValue: (value) => {
      setLocalValue(value);
      if (onChange) {
        onChange(formatValueRef.current(value));
      }
    },
  };
};
