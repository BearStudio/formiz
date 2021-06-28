import * as React from 'react';
import {
  useContext, useEffect, useState,
} from 'react';
import { FormizStepProps, StepState } from './types/step.types';
import { ErrorStepWithoutName, ErrorStepWithoutForm } from './errors';
import { useFormContext, defaultFormState } from './Formiz';
import { useRefValue } from './utils';

export const StepContext = React.createContext<any>({});
export const useStepContext = (): any => useContext(StepContext);

export const FormizStep: React.FC<FormizStepProps> = ({
  as: Tag = 'div',
  children,
  name,
  label,
  order,
  isEnabled = true,
  style = {},
  autoHide = true,
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

  const actionsRef = useRefValue(actions);
  const subjectsRef = useRefValue(subjects);

  // Subscribe to form state
  useEffect(() => {
    const subscription = subjectsRef.current.onFormUpdate
      .subscription
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, [subjectsRef]);

  useEffect(() => {
    if (isActive && !state.isVisited) {
      setState((prevState) => ({ ...prevState, isVisited: true }));
    }
  }, [isActive, state.isVisited]);

  // Register / Update the step
  useEffect(() => {
    actionsRef.current.updateStep({
      ...state,
      isEnabled,
    });
  }, [actionsRef, state, isEnabled]);

  // Unregister the step
  useEffect(() => () => {
    actionsRef.current.unregisterStep(name);
  }, [actionsRef, name]);

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
          display: autoHide && !isActive ? 'none' : null,
        }}
        {...rest}
      >
        {isEnabled && children}
      </Tag>
    </StepContext.Provider>
  );
};
