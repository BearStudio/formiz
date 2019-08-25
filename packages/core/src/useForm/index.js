import { useState } from 'react';
import { usePrevious } from '../usePrevious';

export const useForm = () => {
  const [state, setState] = useState({
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
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
  });
  const prevState = usePrevious(state);

  const connect = (val) => {
    if (val !== prevState) {
      setState(val);
    }
  };

  return { ...state, __connect__: connect };
};
