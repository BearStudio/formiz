import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import {
  formSubmit, stepGoNext, stepGoPrev, stepGoTo,
} from '../FormContext/actions';
import {
  getFormValues, getStep, getStepPosition, getCurrentStepNameFromState,
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
  connect: PropTypes.func,
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
  connect: () => {},
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
    fields,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    isStepValid,
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
    index,
  }) => ({
    name,
    label,
    isValid,
    isVisited,
    index,
  });

  onChange(values);

  if (isFormValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(values);

    if (isFormValid) {
      onValidSubmit(values);
    } else {
      onInvalidSubmit(values);
    }

    dispatch(formSubmit());
  }, [
    values,
    JSON.stringify(onSubmit),
  ]);

  useEffect(() => {
    connect({
      submit: handleSubmit,
      isValid: isFormValid,
      isSubmitted: isFormSubmitted,
      values,
      currentStep: getStepProperties(currentStep),
      steps: (steps || []).map(getStepProperties),
      isStepValid,
      isFirstStep: currentStepPosition === 0,
      isLastStep: currentStepPosition === stepsCount - 1,
      nextStep: () => { dispatch(stepGoNext()); },
      prevStep: () => { dispatch(stepGoPrev()); },
      goToStep: (name) => { dispatch(stepGoTo(name)); },
    });
  }, [
    dispatch,
    handleSubmit,
    isFormValid,
    isFormSubmitted,
    JSON.stringify(currentStep),
    JSON.stringify(steps),
    isStepValid,
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
