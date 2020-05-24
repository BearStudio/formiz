import * as React from 'react';
import {
  useContext, useEffect, useState, useLayoutEffect,
} from 'react';
import { useRefValue } from './utils';
import { FormizStepProps, StepState } from './types/step.types';
import { ErrorStepWithoutName, ErrorStepWithoutForm } from './errors';
import { useFormContext, defaultFormState } from './Formiz';

export const StepContext = React.createContext<any>({});
export const useStepContext = () => useContext(StepContext);

export const FormizStep = ({
  as: Tag = 'div',
  children,
  name,
  order,
  isEnabled = true,
  style = {},
  ...rest
}: FormizStepProps) => {
  if (!name) {
    throw ErrorStepWithoutName;
  }

  const {
    formStateRef,
    actions,
    subjects,
  } = useFormContext();

  if (!subjects || !actions) {
    throw ErrorStepWithoutForm;
  }

  const [formState, setFormState] = useState(formStateRef?.current ?? defaultFormState);
  const [state, setState] = useState<Partial<StepState>>({
    name,
    isVisited: false,
    order: order ?? 0,
  });
  const stateRef = useRefValue(state);
  const isActive = formState.navigatedStepName
    ? formState.navigatedStepName === name
    : formState.initialStepName === name;

  // Subscribe to form state
  useLayoutEffect(() => {
    const subscription = subjects.onFormUpdate
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (formState.navigatedStepName === name && !state.isVisited && isActive) {
      setState((prevState) => ({ ...prevState, isVisited: true }));
    }
  });

  useEffect(() => {
    actions.updateStep({
      ...state,
      isEnabled,
    });

    return () => {
      actions.unregisterStep(stateRef.current.name);
    };
  }, [state, isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <StepContext.Provider value={{
      name,
    }}
    >
      <Tag
        style={{
          ...style,
          display: !isActive ? 'none' : null,
        }}
        {...rest}
      >
        {isEnabled && children}
      </Tag>
    </StepContext.Provider>
  );
};
