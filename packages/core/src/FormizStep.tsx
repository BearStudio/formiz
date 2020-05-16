import * as React from 'react';
import {
  useContext, useEffect, useState, useRef,
} from 'react';
import { useRefValue, useSubscription } from './utils';
import { FormizStepProps, StepState } from './types/step.types';
import { FormState } from './types/form.types';
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
    actions,
    subjects,
  } = useFormContext();

  if (!subjects || !actions) {
    throw ErrorStepWithoutForm;
  }

  const formStateRef = useRef(defaultFormState);
  const [state, setState] = useState<Partial<StepState>>({
    name,
    isVisited: false,
    order: order ?? 0,
  });
  const stateRef = useRefValue(state);
  const isActive = formStateRef.current.navigatedStepName
    ? formStateRef.current.navigatedStepName === name
    : formStateRef.current.initialStepName === name;

  useSubscription({
    subject: subjects.onFormUpdate,
    action: (x: FormState) => {
      formStateRef.current = x;
    },
  });

  useEffect(() => {
    if (formStateRef.current.navigatedStepName === name && !state.isVisited && isActive) {
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
