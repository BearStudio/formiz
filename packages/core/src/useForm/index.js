import { useState } from 'react';
import { usePrevious } from '../usePrevious';

export const useForm = () => {
  const [state, setState] = useState({
    submit: () => {},
    isValid: true,
    isSubmitted: false,
    values: {},
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

  const formConnector = (val) => {
    if (val !== prevState) {
      setState(val);
    }
  };

  return [state, formConnector];
};
