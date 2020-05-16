import { useRef } from 'react';

export const useRefValue = (value: any): React.RefObject<any> => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
