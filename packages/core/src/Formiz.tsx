import * as React from 'react';
import {
  useEffect, useRef, useContext,
} from 'react';
import { Field } from './types/field.types';
import {
  useRefValue, getFormValues, useSubject, useBehaviorSubject, getFormUniqueId,
} from './utils';
import {
  FormMethods, FormState, FormContextValue, FormizProps, FormFields, KeepValues,
} from './types/form.types';
import { StepState } from './types/step.types';
import * as formActions from './formActions';
import * as fieldsActions from './fieldsActions';

export const defaultFormActions: FormMethods = {
  submit: () => {},
  setFieldsValues: () => {},
};

export const defaultFormState: FormState = {
  id: getFormUniqueId(),
  resetKey: 0,
  isSubmitted: false,
  isValidating: false,
  isValid: true,
  isPristine: true,
  steps: [],
  initialStepName: null,
  navigatedStepName: null,
};

export const FormContext = React.createContext<FormContextValue>({});
export const useFormContext = () => useContext(FormContext);

const getCurrentStep = (formState: FormState) => {
  const currentStepName = formState.navigatedStepName
    || formState.initialStepName;
  return formState.steps
    .find((x) => x.name === currentStepName);
};

export const Formiz = ({
  autoForm = false,
  children = '',
  connect = {},
  id = getFormUniqueId(),
  onChange = () => {},
  onSubmit = () => {},
  onValidSubmit = () => {},
  onInvalidSubmit = () => {},
  onValid = () => {},
  onInvalid = () => {},
}: FormizProps) => {
  const formStateRef = useRef<FormState>({
    ...defaultFormState,
    id,
  });
  const fieldsRef = useRef<FormFields>([]);
  const keepValuesRef = useRef<KeepValues>({});
  const connectRef = useRefValue(connect.__connect__ || (() => {}));
  const onChangeRef = useRefValue(onChange);
  const onSubmitRef = useRefValue(onSubmit);
  const onValidSubmitRef = useRefValue(onValidSubmit);
  const onInvalidSubmitRef = useRefValue(onInvalidSubmit);
  const onValidRef = useRefValue(onValid);
  const onInvalidRef = useRefValue(onInvalid);

  const onFormUpdate = useBehaviorSubject(formStateRef);
  const onFieldsUpdate = useBehaviorSubject(fieldsRef);
  const onExternalFieldsUpdate = useSubject(fieldsRef);
  const onReset = useSubject(formStateRef);

  const checkFormValidity = (): boolean => {
    const isValid = fieldsRef.current
      .every((field: any) => (
        !field?.errors?.length
        && !field?.asyncErrors?.length
        && !field?.externalErrors?.length
      ));

    if (isValid) {
      onValidRef.current();
    } else {
      onInvalidRef.current();
    }

    return isValid;
  };

  const checkStepValidity = (stepName: string): boolean => fieldsRef.current
    .filter((field) => field.stepName === stepName)
    .every((field: any) => (
      !field?.errors?.length
      && !field?.asyncErrors?.length
      && !field?.externalErrors?.length
    ));

  const checkFormPristine = (): boolean => fieldsRef.current
    .every((field: any) => field?.isPristine);

  const checkStepPristine = (stepName: string): boolean => fieldsRef.current
    .filter((field) => field.stepName === stepName)
    .every((field: any) => field?.isPristine);

  const checkFormValidating = (): boolean => fieldsRef.current
    .some((field: any) => field?.isValidating);

  const checkStepValidating = (stepName: string): boolean => fieldsRef.current
    .filter((field) => field.stepName === stepName)
    .some((field: any) => field?.isValidating);

  const updateFormState = (stateToUpdate: Partial<FormState>): void => {
    const newState = { ...formStateRef.current, ...stateToUpdate };
    if (JSON.stringify(newState) === JSON.stringify(formStateRef.current)) {
      return;
    }
    formStateRef.current = newState;
    onFormUpdate.push();
  };

  const goToStep = (stepName: string) => {
    const enabledSteps = formStateRef.current.steps
      .filter(({ isEnabled }) => isEnabled);
    const targetedStepIndex = enabledSteps
      .findIndex(({ name }) => name === stepName);

    if (targetedStepIndex < 0) {
      return;
    }

    updateFormState({
      navigatedStepName: enabledSteps[targetedStepIndex].name,
    });
  };

  const nextStep = () => {
    const enabledSteps = formStateRef.current.steps.filter((x) => x.isEnabled);
    const stepIndex = enabledSteps
      .findIndex((step) => step.name === getCurrentStep(formStateRef.current)?.name);
    const isLastStep = stepIndex === enabledSteps.length - 1;

    if (isLastStep) {
      return;
    }

    goToStep(enabledSteps[stepIndex + 1].name);
  };

  const prevStep = () => {
    const enabledSteps = formStateRef.current.steps.filter((x) => x.isEnabled);
    const stepIndex = enabledSteps
      .findIndex((step) => step.name === getCurrentStep(formStateRef.current)?.name);
    const isFirstStep = stepIndex === 0;

    if (isFirstStep) {
      return;
    }

    goToStep(enabledSteps[stepIndex - 1].name);
  };

  const submit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const { steps } = formStateRef.current;
    updateFormState({
      isSubmitted: true,
      steps: steps.map((step) => ({ ...step, isSubmitted: true })),
    });

    const formatedValues = getFormValues(fieldsRef.current);

    if (formStateRef.current.isValid && !formStateRef.current.isValidating) {
      onValidSubmitRef.current(formatedValues);
    } else {
      onInvalidSubmitRef.current(formatedValues);
    }

    onSubmitRef.current(formatedValues);
  };

  const submitStep = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    updateFormState({
      steps: formStateRef.current.steps.map((step) => ({
        ...step,
        isSubmitted: step.name === getCurrentStep(formStateRef.current)?.name
          ? true
          : step.isSubmitted,
      })),
    });

    const currentStep = getCurrentStep(formStateRef.current);

    if (!currentStep?.isValid || currentStep?.isValidating) {
      return;
    }

    const enabledSteps = formStateRef.current.steps.filter((x) => x.isEnabled);
    const currentStepName = getCurrentStep(formStateRef.current)?.name;
    const isLastStep = enabledSteps[enabledSteps.length - 1]?.name === currentStepName;

    if (isLastStep) {
      submit();
      return;
    }

    nextStep();
  };

  const setFieldsValues = (objectOfValues = {}) => {
    fieldsRef.current = fieldsActions.setFieldsValues(fieldsRef.current, objectOfValues);
    onExternalFieldsUpdate.push();
  };

  const invalidateFields = (objectOfErrors = {}) => {
    fieldsRef.current = fieldsActions.setFieldsExternalErrors(fieldsRef.current, objectOfErrors);
    onExternalFieldsUpdate.push();
  };

  const getFieldStepName = (fieldName: string) => fieldsRef.current
    .find((field: Field) => fieldName === field.name)?.stepName ?? null;

  const validateForm = () => {
    updateFormState({
      isValid: checkFormValidity(),
      isPristine: checkFormPristine(),
      isValidating: checkFormValidating(),
      steps: formStateRef.current.steps.map((step) => ({
        ...step,
        isValid: checkStepValidity(step.name),
        isPristine: checkStepPristine(step.name),
        isValidating: checkStepValidating(step.name),
      })),
    });
  };

  const updateStep = (step: Partial<StepState>): void => {
    updateFormState(formActions.updateStep(formStateRef.current, step));
    validateForm();
  };

  const unregisterStep = (name: string): void => {
    updateFormState({
      ...formActions.unregisterStep(formStateRef.current, name),
      isValid: checkFormValidity(),
    });
    validateForm();
  };

  const registerField = (field: Field): void => {
    delete keepValuesRef.current[field.name];
    fieldsRef.current = fieldsActions.registerField(fieldsRef.current, field);
    onFieldsUpdate.push();
    onChangeRef.current(getFormValues(fieldsRef.current));
    validateForm();
  };

  const updateField = (field: Field): void => {
    fieldsRef.current = fieldsActions.updateField(fieldsRef.current, field);
    onFieldsUpdate.push();
    onChangeRef.current(getFormValues(fieldsRef.current));
    validateForm();
  };

  const unregisterField = (field: Field, shouldKeepValue: boolean): void => {
    if (shouldKeepValue) {
      keepValuesRef.current[field.name] = field.value;
    }
    fieldsRef.current = fieldsActions.unregisterField(fieldsRef.current, field.id);
    onFieldsUpdate.push();
    onChangeRef.current(getFormValues(fieldsRef.current));
    validateForm();
  };

  const reset = (): void => {
    updateFormState(formActions.resetForm(formStateRef.current));
    keepValuesRef.current = {};
    onReset.push();
  };

  const formMethods: FormMethods = {
    submit,
    submitStep,
    setFieldsValues,
    invalidateFields,
    getFieldStepName,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };

  const contextValue: FormContextValue = {
    formStateRef,
    fieldsRef,
    actions: {
      updateStep,
      unregisterStep,
      registerField,
      updateField,
      unregisterField,
    },
    formMethods,
    keepValuesRef,
    subjects: {
      onFormUpdate,
      onFieldsUpdate,
      onExternalFieldsUpdate,
      onReset,
    },
  };

  // Connect
  useEffect(() => {
    connectRef.current(contextValue);
  }, []);

  return (
    <FormContext.Provider value={contextValue}>
      {!autoForm
        ? children
        : (
          <form noValidate onSubmit={submit}>
            {children}
          </form>
        )}
    </FormContext.Provider>
  );
};
