import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { getStep } from '../FormContext/helpers';
import {
  fieldRegister, fieldUnregister, fieldUpdateValidations, fieldSetValue,
} from '../FormContext/actions';
import { useFormStepName } from '../FormStepContext';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const fieldPropTypes = {
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
    rule: x => !!x,
    message: isRequired !== true ? isRequired : '',
  };
};

export const useField = ({
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

  // useEffect(() => {
  //   console.log('Render useField');
  // });

  useEffect(() => {
    dispatch(fieldRegister(name, { value: defaultValue, step: stepName, validations }));

    return () => {
      dispatch(fieldUnregister(name, keepValue));
    };
  }, [name, stepName]);

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

  const field = state.fields.find(f => f.name === name);
  const errorMessages = field ? (field.errors || []).filter(x => !!x) : [];
  const currentStep = getStep(stepName, state.steps);
  const isSubmitted = currentStep.name ? currentStep.isSubmitted : state.isSubmitted;

  return {
    resetKey: state.resetKey,
    value: field ? field.value : null,
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field ? !field.errors.length : true,
    isPristine: field ? field.isPristine : true,
    isSubmitted,
    setValue: (value) => {
      dispatch(fieldSetValue(name, value));
      if (onChange) {
        onChange(value);
      }
    },
  };
};
