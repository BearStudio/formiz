import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { getStep } from '../FormContext/helpers';
import {
  fieldRegister, fieldUnregister, fieldUpdateValidations, fieldSetValue,
} from '../FormContext/actions';
import { useFormStepName } from '../FormStepContext';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

const DEFAULT_FIELD_DEBOUNCE = 100;

export const fieldPropTypes = {
  debounce: PropTypes.number,
  defaultValue: PropTypes.any,
  isRequired: PropTypes.string,
  keepValue: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  validations: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.func,
    message: PropTypes.string,
  })),
};

export const fieldDefaultProps = {
  debounce: DEFAULT_FIELD_DEBOUNCE,
  defaultValue: null,
  isRequired: false,
  keepValue: false,
  onChange: () => {},
  validations: [],
};

const getIsRequiredValidation = (isRequired) => {
  if (!isRequired && isRequired !== '') {
    return {};
  }
  return {
    rule: x => !!x || x === 0,
    message: isRequired !== true ? isRequired : '',
  };
};

export const useField = ({
  debounce = DEFAULT_FIELD_DEBOUNCE,
  defaultValue,
  isRequired,
  keepValue,
  name,
  onChange,
  validations = [],
}) => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();
  const stepName = useFormStepName();

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;
  const field = state.fields.find(f => f.name === name) || {};
  const errorMessages = (field.errors || []).filter(x => !!x);
  const currentStep = getStep(stepName, state.steps);
  const isSubmitted = currentStep.name ? currentStep.isSubmitted : state.isSubmitted;
  const [localValue, setLocalValue] = useState(field.value || defaultValue);

  const debounceRef = useRef(debounce);
  debounceRef.current = debounce;

  const defaultValueRef = useRef();
  defaultValueRef.current = defaultValue;

  const valueRef = useRef();
  valueRef.current = field.value;

  const keepValueRef = useRef();
  keepValueRef.current = keepValue;

  // Reset value if resetKey change
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (!isFirstMountRef.current) {
      setLocalValue(defaultValueRef.current);
    }
    isFirstMountRef.current = false;
  }, [state.resetKey]);

  // Update state value from local value
  useEffect(() => {
    if (localValue === defaultValueRef.current) {
      return () => {};
    }

    if (!debounceRef.current) {
      dispatch(fieldSetValue(name, localValue));
      return () => {};
    }

    const timer = setTimeout(() => {
      dispatch(fieldSetValue(name, localValue));
    }, debounceRef.current);

    return () => {
      clearTimeout(timer);
    };
  }, [localValue, name]);

  // Mount & Unmount field
  useEffect(() => {
    dispatch(fieldRegister(name, {
      value: defaultValueRef.current,
      step: stepName,
    }));

    return () => {
      dispatch(fieldUnregister(name, keepValueRef.current));
    };
  }, [
    name,
    stepName,
  ]);

  // Update Validations
  useEffect(() => {
    const extraRules = [
      getIsRequiredValidation(isRequired),
    ];

    dispatch(fieldUpdateValidations(name, [
      ...extraRules,
      ...validations,
    ]));
  }, [
    name,
    JSON.stringify(validations),
    JSON.stringify(isRequired),
  ]);

  return {
    id: `${field.id || state.id}-${name}`,
    resetKey: state.resetKey,
    value: localValue || '',
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field.errors ? !field.errors.length : true,
    isPristine: !!field.isPristine,
    isSubmitted,
    setValue: (value) => {
      setLocalValue(value);
      if (onChange) {
        onChange(value);
      }
    },
  };
};
