import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import {
  formSubmit, formInvalidateFields, stepSubmit, stepGoNext, stepGoPrev, stepGoTo, formReset,
} from '../FormContext/actions';
import {
  getFormValues, getStep, getStepPosition, getCurrentStepNameFromState, getFieldStepName,
} from '../FormContext/helpers';

export const propTypes = {
  children: PropTypes.node,
  autoForm: PropTypes.bool,
  onSubmit: PropTypes.func,
  onValidSubmit: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onChange: PropTypes.func,
  connect: PropTypes.shape({
    __connect__: PropTypes.func,
  }),
};

export const defaultProps = {
  children: '',
  autoForm: false,
  onSubmit: () => {},
  onValidSubmit: () => {},
  onInvalidSubmit: () => {},
  onValid: () => {},
  onInvalid: () => {},
  onChange: () => {},
  connect: {
    __connect__: () => {},
  },
};

export const Form = ({
  children,
  autoForm,
  onSubmit,
  onValidSubmit,
  onInvalidSubmit,
  onValid,
  onInvalid,
  onChange,
  connect,
}) => {
  const { state, dispatch } = useFormContext();
  const {
    id,
    fields,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    steps,
  } = state;

  const values = useMemo(() => getFormValues(fields), [fields]);

  const stepsCount = (steps || []).length;

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, steps);
  const currentStepPosition = getStepPosition(currentStepName, steps);

  const getStepProperties = ({
    name,
    label,
    isValid,
    isVisited,
    isSubmitted,
    index,
  }) => ({
    name,
    label,
    isValid,
    isVisited,
    isSubmitted,
    index,
  });

  onChange(values);

  if (isFormValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(formSubmit(onSubmit, onValidSubmit, onInvalidSubmit));
  };

  const handleStepSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(stepSubmit(currentStepName, onSubmit, onValidSubmit, onInvalidSubmit));
  };

  useEffect(() => {
    connect.__connect__({
      id,
      submit: handleSubmit,
      isValid: isFormValid,
      isSubmitted: isFormSubmitted,
      values,
      invalidateFields: (fieldsErrors) => { dispatch(formInvalidateFields(fieldsErrors)); },
      reset: () => { dispatch(formReset()); },
      currentStep: getStepProperties(currentStep),
      steps: (steps || []).map(getStepProperties),
      isStepValid: currentStep.isValid,
      isStepSubmitted: currentStep.isSubmitted,
      isFirstStep: currentStepPosition === 0,
      isLastStep: currentStepPosition === stepsCount - 1,
      submitStep: handleStepSubmit,
      getFieldStepName: fieldName => getFieldStepName(fieldName, fields),
      nextStep: () => { dispatch(stepGoNext()); },
      prevStep: () => { dispatch(stepGoPrev()); },
      goToStep: (name) => { dispatch(stepGoTo(name)); },
    });
  }, [
    dispatch,
    JSON.stringify(connect.__connect__),
    JSON.stringify(handleSubmit),
    JSON.stringify(handleStepSubmit),
    id,
    isFormValid,
    isFormSubmitted,
    JSON.stringify(values),
    JSON.stringify(steps),
    JSON.stringify(fields),
    JSON.stringify(currentStep),
    currentStepPosition,
    stepsCount,
  ]);

  if (!autoForm) {
    return children;
  }

  return (
    <form onSubmit={handleSubmit}>
      { children }
    </form>
  );
};

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;