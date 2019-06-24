import { useState } from 'react';
import { usePrevious } from '../usePrevious';

export const useForm = () => {
  const [state, setState] = useState({
    submit: () => {},
    isValid: true,
    isSubmitted: false,
    currentStep: {},
    steps: [],
    isStepValid: true,
    isFirstStep: true,
    isLastStep: true,
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
  });
  const prevState = usePrevious(state);

  const formConnector = (val) => {
    if (val !== prevState) {
      setState(val);
    }
  };

  return [state, formConnector];
};
