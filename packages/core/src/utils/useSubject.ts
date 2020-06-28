import React, { useRef } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export const useSubject = (valueRef: React.RefObject<any>, throttle = 0) => {
  const subjectRef = useRef(new Subject());
  const push = (value?: any) => {
    subjectRef.current.next(value ?? valueRef.current);
  };

  const subscribe = (action: any) => {
    const subscription = subjectRef.current
      .pipe(throttleTime(throttle, undefined, { leading: true, trailing: true }))
      .subscribe(action);
    return subscription;
  };

  return { push, subscribe };
};


export const useBehaviorSubject = (valueRef: React.RefObject<any>, throttle = 0) => {
  const subjectRef = useRef(new BehaviorSubject(valueRef.current));
  const push = (value?: any) => {
    subjectRef.current.next(value ?? valueRef.current);
  };

  const subscribe = (action: any) => {
    const subscription = subjectRef.current
      .pipe(throttleTime(throttle, undefined, { leading: true, trailing: true }))
      .subscribe(action);
    return subscription;
  };

  return { push, subscribe };
};
