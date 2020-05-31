import React, { useRef } from 'react';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export const useSubject = (valueRef: React.RefObject<any>, throttle = 0) => {
  const subjectRef = useRef(new BehaviorSubject(valueRef.current));
  const push = () => {
    subjectRef.current.next(valueRef.current);
  };

  const subscribe = (action: any) => {
    const subsciption = subjectRef.current
      .pipe(throttleTime(throttle, undefined, { leading: true, trailing: true }))
      .subscribe(action);
    return subsciption;
  };

  return { push, subscribe };
};
