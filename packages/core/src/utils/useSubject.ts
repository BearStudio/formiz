import React, { useRef } from 'react';
import { Subject } from 'rxjs';

export const useSubject = (valueRef: React.RefObject<any>) => {
  const subjectRef = useRef(new Subject());
  const push = () => {
    subjectRef.current.next(valueRef.current);
  };

  const subscribe = (action: any) => {
    const subsciption = subjectRef.current.subscribe(action);
    subjectRef.current.next(valueRef.current);
    return subsciption;
  };

  return { push, subscribe };
};
