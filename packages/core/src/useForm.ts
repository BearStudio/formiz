import {
  useCallback, useState, useRef, useEffect,
} from 'react';
import { Subscription } from 'rxjs';
import {
  defaultFormState,
  useFormContext,
} from './Formiz';
import { getFormValues, useRefValue } from './utils';
import {
  FormFields,
  UseFormProps,
  UseFormValues,
} from './types/form.types';

const shouldSubscribe = (subscribe: UseFormProps['subscribe'], key: 'form' | 'fields') => {
  if (subscribe === true) {
    return true;
  }

  if (subscribe === key) {
    return true;
  }

  if (typeof subscribe !== 'object') {
    return false;
  }

  if (!subscribe[key]) {
    return false;
  }

  return true;
};

export const useForm = ({
  subscribe = true,
}: UseFormProps = {}): UseFormValues => {
  const {
    formStateRef, fieldsRef, formMethods, subjects,
  } = useFormContext();
  const [methods, setMethods] = useState(formMethods);
  const [localFormState, setLocalFormState] = useState(formStateRef?.current ?? defaultFormState);
  const [localFields, setLocalFields] = useState<FormFields>(fieldsRef?.current ?? []);
  const localFieldsRef = useRefValue(localFields);
  const subscriptionsRef = useRef<Array<Subscription>>([]);

  const subscribeOnFormUpdate = (subject: any) => {
    if (!subject || !shouldSubscribe(subscribe, 'form')) {
      return;
    }
    const subscription = subject
      .subscription
      .subscribe(setLocalFormState);
    subscriptionsRef.current.push(subscription);
  };

  const subscribeOnFieldsUpdate = (subject: any) => {
    if (!subject || !shouldSubscribe(subscribe, 'fields')) {
      return;
    }

    const subscribeFields = typeof subscribe === 'object' && typeof subscribe.fields === 'object' ? subscribe.fields : null;
    const subscription = subject
      .subscription
      .subscribe((nextFields: FormFields) => {
        const nextState = subscribeFields
          ? nextFields.filter((x) => subscribeFields.includes(x.name))
          : nextFields;

        if (JSON.stringify(localFieldsRef.current) === JSON.stringify(nextState)) {
          return;
        }

        setLocalFields(nextState);
      });
    subscriptionsRef.current.push(subscription);
  };

  // Use the connect property to retrieve the state
  const connect = useCallback(({
    formMethods: _formMethods,
    subjects: _subjects,
  }) => {
    setMethods(_formMethods);
    subscribeOnFormUpdate(_subjects?.onFormUpdate);
    subscribeOnFieldsUpdate(_subjects?.onFieldsUpdate);
  }, []);

  // Subscribe (if not used with connect)
  useEffect(() => {
    subscribeOnFormUpdate(subjects?.onFormUpdate);
    subscribeOnFieldsUpdate(subjects?.onFieldsUpdate);
  }, []);

  // Clear all subscriptions at unmount
  useEffect(() => () => {
    subscriptionsRef.current.forEach((subscription) => subscription?.unsubscribe());
  }, []);

  const enabledSteps = localFormState.steps
    .filter((x) => x.isEnabled)
    .map(({
      name,
      label,
      isSubmitted,
      isPristine,
      isValidating,
      isValid,
      isVisited,
    }, index) => ({
      index,
      name,
      label,
      isPristine: isPristine ?? false,
      isSubmitted: isSubmitted ?? false,
      isValid: isValid ?? false,
      isValidating: isValidating ?? false,
      isVisited: isVisited ?? false,
    }))
    .map((x, index) => ({ ...x, index }));

  const currentStep = enabledSteps
    .find((x) => x.name === (localFormState.navigatedStepName || localFormState.initialStepName))
    || null;

  return {
    ...methods,
    ...(shouldSubscribe(subscribe, 'form') ? {
      resetKey: localFormState.resetKey,
      isSubmitted: localFormState.isSubmitted,
      isValid: localFormState.isValid,
      isValidating: localFormState.isValidating,
      isPristine: localFormState.isPristine,
      steps: enabledSteps,
      currentStep: currentStep || {},
      isStepPristine: currentStep ? currentStep.isPristine : localFormState.isPristine,
      isStepValid: currentStep ? currentStep.isValid : localFormState.isValid,
      isStepValidating: currentStep ? currentStep.isValidating : localFormState.isValidating,
      isStepSubmitted: currentStep ? currentStep.isSubmitted : localFormState.isSubmitted,
      isFirstStep: enabledSteps[0]?.name === currentStep?.name,
      isLastStep: enabledSteps[enabledSteps.length - 1]?.name === currentStep?.name,
    } : {}),
    ...(shouldSubscribe(subscribe, 'fields') ? {
      values: getFormValues(localFields),
    } : {}),
    __connect__: connect,
  };
};
