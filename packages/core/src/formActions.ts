import { FormState, ResetOptions } from './types/form.types';
import { StepState } from './types/step.types';
import { isResetAllowed } from './utils';

export const updateStep = (state: FormState, partialStepState: Partial<StepState>): FormState => {
  if (!partialStepState || !partialStepState.name) return state;

  const stepIndex = state.steps.findIndex((x: StepState) => x.name === partialStepState.name);
  const step = state.steps[stepIndex];

  const newStep: StepState = {
    ...(step || {}),
    ...partialStepState,
  };

  if (JSON.stringify(newStep) === JSON.stringify(step)) {
    return state;
  }

  const newSteps = [...state.steps];

  if (!step) {
    newSteps.push(newStep);
  } else {
    newSteps[stepIndex] = newStep;
  }

  const orderedSteps = newSteps
    .sort((a, b) => a.order - b.order);

  const enabledSteps = orderedSteps.filter(({ isEnabled }) => isEnabled);

  const initialStepName = enabledSteps.length ? enabledSteps[0].name : null;

  const newState = {
    ...state,
    initialStepName,
    steps: orderedSteps,
  };

  return newState;
};

export const unregisterStep = (state: FormState, name: string): FormState => {
  if (!name) return state;
  const newState = {
    ...state,
    steps: state.steps.filter((x) => x.name !== name),
  };
  return newState;
};

export const resetForm = (state: FormState, resetOptions: ResetOptions = {}): FormState => {
  const newState = {
    ...state,
    resetKey: isResetAllowed('resetKey', resetOptions) ? state.resetKey + 1 : state.resetKey,
    isSubmitted: isResetAllowed('submitted', resetOptions) ? false : state.isPristine,
    isPristine: isResetAllowed('pristine', resetOptions) ? true : state.isPristine,
    navigatedStepName: isResetAllowed('currentStep', resetOptions) ? null : state.navigatedStepName,
    steps: state.steps.map((step) => ({
      ...step,
      isSubmitted: isResetAllowed('submitted', resetOptions) ? false : step.isSubmitted,
      isPristine: isResetAllowed('pristine', resetOptions) ? true : step.isPristine,
      isVisited: isResetAllowed('visited', resetOptions) ? false : step.isVisited,
    })),
  };
  return newState;
};
