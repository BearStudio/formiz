import { FormState } from './types/form.types';
import { StepState } from './types/step.types';

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

export const resetForm = (state: FormState): FormState => {
  const newState = {
    ...state,
    resetKey: state.resetKey + 1,
    isSubmitted: false,
    isValid: true,
    navigatedStepName: null,
    steps: state.steps.map((step) => ({
      ...step,
      isSubmitted: false,
      isVisited: false,
    })),
  };
  return newState;
};
