import {
  formInvalidateFields, stepGoNext, stepGoPrev, stepGoTo, formReset, formSubmit, stepSubmit,
} from '../FormContext/actions';
import {
  getFormValues,
  getCurrentStepNameFromState,
  getStep,
  getStepPosition,
  getFieldStepName,
  getEnabledSteps,
} from '../FormContext/helpers';
import { useFormContext } from '../FormContext';

export const initialFormState = {
  id: null,
  submit: () => {},
  isValid: true,
  isSubmitted: false,
  values: {},
  invalidateFields: () => {},
  reset: () => {},
  resetKey: 0,
  currentStep: {},
  steps: [],
  isStepValid: true,
  isStepSubmitted: false,
  isFirstStep: true,
  isLastStep: true,
  submitStep: () => {},
  getFieldStepName: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
};

export const useFormState = () => {
  const formContext = useFormContext();

  if (!formContext) {
    return null;
  }

  const {
    state, dispatch, onSubmit, onValidSubmit, onInvalidSubmit,
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
    id,
    submit: handleSubmit,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    values,
    invalidateFields: (fieldsErrors) => { dispatch(formInvalidateFields(fieldsErrors)); },
    reset: () => { dispatch(formReset()); },
    resetKey,
    currentStep: getStepProperties(currentStep),
    steps: enabledSteps.map(getStepProperties),
    isStepValid: currentStep.isValid,
    isStepSubmitted: currentStep.isSubmitted,
    isFirstStep: currentStepPosition === 0,
    isLastStep: currentStepPosition === stepsCount - 1,
    submitStep: handleStepSubmit,
    getFieldStepName: (fieldName) => getFieldStepName(fieldName, fields),
    nextStep: () => { dispatch(stepGoNext()); },
    prevStep: () => { dispatch(stepGoPrev()); },
    goToStep: (name) => { dispatch(stepGoTo(name)); },
  };
};
