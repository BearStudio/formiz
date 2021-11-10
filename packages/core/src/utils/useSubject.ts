import React, { useRef } from 'react';
import { BehaviorSubject, Subject } from 'rxjs';

export const useSubject = (valueRef?: React.RefObject<unknown>) => {
  const subjectRef = useRef(new Subject());
  const push = (value?: unknown) => {
    subjectRef.current.next(value ?? valueRef?.current);
  };

  const subscription = subjectRef.current.pipe();

  return { push, subscription };
};

export const useBehaviorSubject = (valueRef: React.RefObject<unknown>) => {
  const subjectRef = useRef(new BehaviorSubject(valueRef.current));
  const push = (value?: unknown) => {
    subjectRef.current.next(value ?? valueRef.current);
  };

  const subscription = subjectRef.current.pipe();

  return { push, subscription };
};
