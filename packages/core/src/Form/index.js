import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from './Context';
import {
  formSubmit, stepGoNext, stepGoPrev, stepGoTo,
} from './Context/actions';
import {
  getFormValues, getStep, getStepPosition, getCurrentStepNameFromState,
} from './Context/helpers';

export const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onChange: PropTypes.func,
};

export const defaultProps = {
  children: '',
  onSubmit: () => {},
  onValid: () => {},
  onInvalid: () => {},
  onChange: () => {},
};

export const Form = ({
  children,
  onSubmit,
  onValid,
  onInvalid,
  onChange,
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

  onChange(getFormValues(fields));

  if (isValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(getFormValues(fields));
    dispatch(formSubmit());
  };

  if (typeof children === 'function') {
    return children({
      submit: handleSubmit,
      isValid,
      isSubmitted,
      currentStep,
      // eslint-disable-next-line no-shadow
      steps: (steps || []).map(({ name, isValid }) => ({
        name,
        isValid,
      })),
      isStepValid,
      isFirstStep: currentStepPosition === 0,
      isLastStep: currentStepPosition === stepsCount - 1,
      nextStep: () => { dispatch(stepGoNext()); },
      prevStep: () => { dispatch(stepGoPrev()); },
      goToStep: (name) => { dispatch(stepGoTo(name)); },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      { children }
    </form>
  );
};


Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
