import React, { useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const useSubject = (valueRef: React.RefObject<any>, debounce = 0) => {
  const subjectRef = useRef(new Subject());
  const push = () => {
    subjectRef.current.next(valueRef.current);
  };

  const subscribe = (action: any) => {
    const subsciption = subjectRef.current
      .pipe(debounceTime(debounce))
      .subscribe(action);
    subjectRef.current.next(valueRef.current);
    return subsciption;
  };

  return { push, subscribe };
};
