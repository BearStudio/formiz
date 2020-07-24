import * as React from 'react';
import {
  useContext, useEffect, useState,
} from 'react';
import { FormizStepProps, StepState } from './types/step.types';
import { ErrorStepWithoutName, ErrorStepWithoutForm } from './errors';
import { useFormContext, defaultFormState } from './Formiz';

export const StepContext = React.createContext<any>({});
export const useStepContext = () => useContext(StepContext);

export const FormizStep = ({
  as: Tag = 'div',
  children,
  name,
  label,
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
    label,
    isVisited: false,
    order: order ?? 0,
  });
  const isActive = formState.navigatedStepName
    ? formState.navigatedStepName === name
    : formState.initialStepName === name;

  // Subscribe to form state
  useEffect(() => {
    const subscription = subjects.onFormUpdate
      .subscription
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (formState.navigatedStepName === name && !state.isVisited && isActive) {
      setState((prevState) => ({ ...prevState, isVisited: true }));
    }
  });

  // Register / Update the step
  useEffect(() => {
    actions.updateStep({
      ...state,
      isEnabled,
    });
  }, [state, isEnabled]);

  // Unregister the step
  useEffect(() => () => {
    actions.unregisterStep(name);
  }, [name]);

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
