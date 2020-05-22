import {
  useCallback, useState, useRef,
} from 'react';
import {
  defaultFormState,
  useFormContext,
} from './Formiz';
import { getFormValues, useSubscription } from './utils';
import {
  FormFields,
  UseFormProps,
  UseFormValues,
} from './types/form.types';

export const useForm = ({
  stateLevel = 'fields',
}: UseFormProps = {}): UseFormValues => {
  const { formMethods, subjects } = useFormContext();
  const [methods, setMethods] = useState(formMethods);
  const [formState, setFormState] = useState(defaultFormState);
  const [fieldsState, setFieldsState] = useState<FormFields>([]);
  const subjectRef = useRef<any>(subjects);

  // Use the connect property to retrieve the state
  const connect = useCallback(({
    formMethods: _formMethods,
    subjects: _subjects,
  }) => {
    setMethods(_formMethods);
    subjectRef.current = _subjects;
  }, []);

  // Form Update
  useSubscription({
    subject: subjectRef.current?.onFormUpdate,
    action: setFormState,
    isEnabled: ['form', 'fields'].includes(stateLevel),
  });

  // Fields Update
  useSubscription({
    subject: subjectRef.current?.onFieldsUpdate,
    action: setFieldsState,
    isEnabled: ['fields'].includes(stateLevel),
  });

  const enabledSteps = formState.steps
    .filter((x) => x.isEnabled)
    .map(({
      name,
      isSubmitted,
      isValid,
      isVisited,
    }, index) => ({
      index,
      name,
      isSubmitted,
      isValid,
      isVisited,
    }))
    .map((x, index) => ({ ...x, index }));

  const currentStep = enabledSteps
    .find((x) => x.name === (formState.navigatedStepName || formState.initialStepName)) || null;

  return {
    ...methods,
    ...(['form', 'fields'].includes(stateLevel) ? {
      resetKey: formState.resetKey,
      isSubmitted: formState.isSubmitted,
      isValid: formState.isValid,
      isPristine: formState.isPristine,
      steps: enabledSteps,
      currentStep: currentStep || {},
      isStepValid: !!currentStep?.isValid,
      isStepSubmitted: !!currentStep?.isSubmitted,
      isFirstStep: enabledSteps[0]?.name === currentStep?.name,
      isLastStep: enabledSteps[enabledSteps.length - 1]?.name === currentStep?.name,
    } : {}),
    ...(['fields'].includes(stateLevel) ? {
      values: getFormValues(fieldsState),
    } : {}),
    __connect__: connect,
  };
};
