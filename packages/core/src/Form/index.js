import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import {
  formSubmit, formInvalidateFields, stepSubmit, stepGoNext, stepGoPrev, stepGoTo, formReset,
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

  const handleSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(formSubmit(onSubmit, onValidSubmit, onInvalidSubmit));
  }, [
    JSON.stringify(onSubmit),
    JSON.stringify(onValidSubmit),
    JSON.stringify(onInvalidSubmit),
  ]);

  const handleStepSubmit = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }

    dispatch(stepSubmit(currentStepName, onSubmit, onValidSubmit, onInvalidSubmit));
  }, [
    currentStepName,
    JSON.stringify(onSubmit),
    JSON.stringify(onValidSubmit),
    JSON.stringify(onInvalidSubmit),
  ]);

  useEffect(() => {
    connect.__connect__({
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
      nextStep: () => { dispatch(stepGoNext()); },
      prevStep: () => { dispatch(stepGoPrev()); },
      goToStep: (name) => { dispatch(stepGoTo(name)); },
    });
  }, [
    JSON.stringify(connect.__connect__),
    dispatch,
    handleSubmit,
    isFormValid,
    isFormSubmitted,
    JSON.stringify(currentStep),
    JSON.stringify(steps),
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
