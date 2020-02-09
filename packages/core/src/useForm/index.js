import { useState } from 'react';
import { getExposedState } from './getExposedState';
import { initialExposedState } from './initialExposedState';
import { useFormContext } from '../FormContext';

export const useForm = () => {
  const [state, setState] = useState(initialExposedState);
  const formContext = useFormContext();

  // Use form context to retrieve the state
  if (formContext) {
    return getExposedState(formContext);
  }

  // Use the connect property to retrieve the state
  const connect = (val) => {
    setState(val);
  };

  return { ...state, __connect__: connect };
};
