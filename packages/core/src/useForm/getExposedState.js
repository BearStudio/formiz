import {
  getFormValues,
  getEnabledSteps,
  getCurrentStepNameFromState,
  getStep,
  getStepPosition,
  getFieldStepName,
} from '../FormContext/helpers';
import {
  formSubmit,
  stepSubmit,
  formInvalidateFields,
  formSetFieldsValues,
  formReset,
  stepGoNext,
  stepGoPrev,
  stepGoTo,
} from '../FormContext/actions';
import { initialExposedState } from './initialExposedState';

export const getExposedState = (formContext) => {
  if (!formContext) {
    return initialExposedState;
  }

  const {
    state,
    dispatch,
    onSubmit,
    onValidSubmit,
    onInvalidSubmit,
  } = formContext;

  const {
    id,
    fields,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    steps,
    resetKey,
  } = state;

  const values = getFormValues(fields);

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

  const enabledSteps = getEnabledSteps(steps);
  const stepsCount = enabledSteps.length;

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, enabledSteps);
  const currentStepPosition = getStepPosition(currentStepName, enabledSteps);

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

  return {
    // State
    id,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    values,
    resetKey,
    currentStep: getStepProperties(currentStep),
    steps: enabledSteps.map(getStepProperties),
    isStepValid: currentStep.isValid,
    isStepSubmitted: currentStep.isSubmitted,
    isFirstStep: currentStepPosition === 0,
    isLastStep: currentStepPosition === stepsCount - 1,

    // Actions
    submit: handleSubmit,
    invalidateFields: (fieldsErrors) => { dispatch(formInvalidateFields(fieldsErrors)); },
    setFieldsValues: (fieldsValues) => { dispatch(formSetFieldsValues(fieldsValues)); },
    reset: () => { dispatch(formReset()); },
    submitStep: handleStepSubmit,
    getFieldStepName: (fieldName) => getFieldStepName(fieldName, fields),
    nextStep: () => { dispatch(stepGoNext()); },
    prevStep: () => { dispatch(stepGoPrev()); },
    goToStep: (name) => { dispatch(stepGoTo(name)); },
  };
};
