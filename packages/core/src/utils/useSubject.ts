import React, { useRef } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export const useSubject = (valueRef: React.RefObject<any>, throttle = 100) => {
  const subjectRef = useRef(new Subject());
  const push = (value?: any) => {
    subjectRef.current.next(value ?? valueRef.current);
  };

  const subscription = subjectRef.current
    .pipe(throttleTime(throttle, undefined, { leading: true, trailing: true }));

  return { push, subscription };
};


export const useBehaviorSubject = (valueRef: React.RefObject<any>, throttle = 100) => {
  const subjectRef = useRef(new BehaviorSubject(valueRef.current));
  const push = (value?: any) => {
    subjectRef.current.next(value ?? valueRef.current);
  };

  const subscription = subjectRef.current
    .pipe(throttleTime(throttle, undefined, { leading: true, trailing: true }));

  return { push, subscription };
};
