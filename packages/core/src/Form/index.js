import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import dequal from 'dequal';
import { usePrevious } from '../usePrevious';
import { useFormContext } from './Context';
import {
  formSubmit, stepGoNext, stepGoPrev, stepGoTo,
} from './Context/actions';
import {
  getFormValues, getStep, getStepPosition, getCurrentStepNameFromState,
} from './Context/helpers';

export const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  noFormTag: PropTypes.bool,
  onSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onChange: PropTypes.func,
  connect: PropTypes.func,
};

export const defaultProps = {
  children: '',
  noFormTag: false,
  onSubmit: () => {},
  onValid: () => {},
  onInvalid: () => {},
  onChange: () => {},
  connect: () => {},
};

export const Form = ({
  children,
  noFormTag,
  onSubmit,
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

  const stepsCount = (steps || []).length;

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, steps);
  const currentStepPosition = getStepPosition(currentStepName, steps);

  const prevStep = usePrevious(currentStep);
  const prevSteps = usePrevious(steps);
  const prevOnSubmit = usePrevious(onSubmit);

  onChange(getFormValues(fields));

  if (isValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(getFormValues(fields));
    dispatch(formSubmit());
  }, [
    fields,
    !dequal(onSubmit, prevOnSubmit),
  ]);

  useEffect(() => {
    connect({
      submit: handleSubmit,
      isValid,
      isSubmitted,
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
    !dequal(currentStep, prevStep),
    !dequal(steps, prevSteps),
    isStepValid,
    currentStepPosition,
    stepsCount,
  ]);

  if (noFormTag) {
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
