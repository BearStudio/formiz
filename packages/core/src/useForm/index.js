import { useState } from 'react';
import { usePrevious } from '../usePrevious';
import { initialExposedFormState } from '../useExposedFormState';

export const useForm = () => {
  const [state, setState] = useState(initialExposedFormState);
  const prevState = usePrevious(state);

  const connect = (val) => {
    if (val !== prevState) {
      setState(val);
    }
  };

  return { ...state, __connect__: connect };
};
