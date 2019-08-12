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
    isValid,
    isSubmitted,
    isStepValid,
    steps,
  } = state;

  const values = useMemo(() => getFormValues(fields), [fields]);

  const stepsCount = (steps || []).length;

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, steps);
  const currentStepPosition = getStepPosition(currentStepName, steps);

  onChange(values);

  if (isValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(values);

    if (isValid) {
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
      isValid,
      isSubmitted,
      values,
      currentStep,
      // eslint-disable-next-line no-shadow
      steps: (steps || []).map(({ name, isValid, isVisited }) => ({
        name,
        isValid,
        isVisited,
      })),
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
    isValid,
    isSubmitted,
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
