import { useState } from 'react';
import { initialFormState, useFormState } from '../useFormState';

export const useForm = () => {
  const [state, setState] = useState(initialFormState);
  const formState = useFormState();

  // Use form context to retrieve the state
  if (formState) {
    return formState;
  }

  // Use the connect property to retrieve the state
  const connect = (val) => {
    setState(val);
  };

  return { ...state, __connect__: connect };
};
