import {
  useCallback, useState, useRef, useLayoutEffect,
} from 'react';
import {
  defaultFormState,
  useFormContext,
} from './Formiz';
import { getFormValues } from './utils';
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
  useLayoutEffect(() => {
    if (!subjectRef.current || !['form', 'fields'].includes(stateLevel)) {
      return () => {};
    }

    const subscription = subjectRef.current.onFormUpdate
      .subscribe(setFormState);
    return () => subscription.unsubscribe();
  }, [subjectRef.current]);

  // Fields Update
  useLayoutEffect(() => {
    if (!subjectRef.current || !['fields'].includes(stateLevel)) {
      return () => {};
    }

    const subscription = subjectRef.current.onFieldsUpdate
      .subscribe(setFieldsState, 100);
    return () => subscription.unsubscribe();
  }, [subjectRef.current]);

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
