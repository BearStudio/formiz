import {
  formInvalidateFields, stepGoNext, stepGoPrev, stepGoTo, formReset, formSubmit, stepSubmit,
} from '../FormContext/actions';
import {
  getFormValues, getCurrentStepNameFromState, getStep, getStepPosition, getFieldStepName,
} from '../FormContext/helpers';
import { useFormContext } from '../FormContext';

export const initialExposedFormState = {
  id: null,
  submit: () => {},
  isValid: true,
  isSubmitted: false,
  values: {},
  invalidateFields: () => {},
  reset: () => {},
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

export const useExposedFormState = ({
  dispatch,
  state,
}) => {
  const {
    id,
    fields,
    isValid: isFormValid,
    isSubmitted: isFormSubmitted,
    steps,
  } = state;

  const { onSubmit, onValidSubmit, onInvalidSubmit } = useFormContext();

  const values = getFormValues(fields);

  const stepsCount = (steps || []).length;

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, steps);
  const currentStepPosition = getStepPosition(currentStepName, steps);

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

  return {
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
  };
};
