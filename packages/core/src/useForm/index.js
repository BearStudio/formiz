import { useState } from 'react';

export const useForm = () => {
  const [form, setForm] = useState({
    submit: () => {},
    isValid: true,
    isSubmitted: false,
    currentStep: null,
    steps: [],
    isStepValid: true,
    isFirstStep: true,
    isLastStep: true,
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
  });

  const formConnector = (val) => {
    setForm(val);
  };

  return [form, formConnector];
};
