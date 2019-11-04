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

const getValidations = (isRequired, validations) => {
  const extraRules = [
    getIsRequiredValidation(isRequired),
  ];

  return [
    ...extraRules,
    ...validations,
  ]
    .filter(x => x.rule)
    .map(x => ({ ...x, rule: memoized(x.rule) }));
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
  const field = state.fields.find(f => f.name === name) || {};
  const errorMessages = (field.errors || []).filter(x => !!x);
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

  const isFirstRenderRef = useRef(true);

  // Mount & Unmount field
  useEffect(() => {
    dispatch(fieldRegister(
      fieldId,
      name,
      {
        value: localValueRef.current || defaultValueRef.current,
        step: stepName,
        validations: getValidations(isRequired, validations),
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

  // Update state value from local value
  useEffect(() => {
    if (isFirstRenderRef.current) {
      return () => {};
    }

    if (!debounceRef.current) {
      dispatch(fieldSetValue(fieldId, localValue));
      return () => {};
    }

    const timer = setTimeout(() => {
      dispatch(fieldSetValue(fieldId, localValue));
    }, debounceRef.current);

    return () => {
      clearTimeout(timer);
    };
  }, [JSON.stringify(localValue), fieldId]);

  // Update Validations
  useEffect(() => {
    if (!isFirstRenderRef.current) {
      dispatch(fieldUpdateValidations(fieldId, getValidations(isRequired, validations)));
    }
  }, [
    fieldId,
    JSON.stringify(validations),
    JSON.stringify(isRequired),
    ...validations.reduce((acc, cur) => [...acc, ...(cur.deps || [])], []),
  ]);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  return {
    id: fieldId,
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
