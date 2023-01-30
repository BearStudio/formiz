import type {
  ExposedFieldState,
  ExposedExternalFieldState,
  Field,
  Step,
  Store,
  ResetOptions,
} from "@/types";
import {
  getFormIsValid,
  getFormIsPristine,
  getFormIsValidating,
  getFieldIsValid,
  getFieldIsPristine,
  getFieldIsValidating,
  getFieldIsDebouncing,
  getFieldIsProcessing,
  getFieldIsReady,
  getStepIsValid,
  getStepIsPristine,
  getStepIsValidating,
} from "@/utils/form";

export const formInterfaceSelector = (state: Store) => {
  const currentStep = state.steps.find(
    (step) => step.name === state.form.currentStepName
  );

  return {
    submit: state.actions.submitForm,
    setValues: state.actions.setValues,
    setErrors: state.actions.setErrors,
    getStepByFieldName: (fieldName: string) => {
      const field = [...state.fields.values()].find(
        (f) => f.name === fieldName
      );
      const step = state.steps.find((s) => s.name === field?.stepName);
      if (!step) return undefined;
      return stepInterfaceSelector(state)(step);
    },
    reset: (options?: ResetOptions) => {
      state.actions.reset(options);
      state.actions.resetInitialValues();
    },
    submitStep: state.actions.submitStep,
    goToStep: state.actions.goToStep,
    goToNextStep: state.actions.goToNextStep,
    goToPreviousStep: state.actions.goToPreviousStep,

    id: state.form.id,
    resetKey: state.form.resetKey,
    isSubmitted: state.form.isSubmitted,
    isValid: getFormIsValid(state.fields),
    isValidating: getFormIsValidating(state.fields),
    isPristine: getFormIsPristine(state.fields),
    steps: state.steps
      .filter((step) => step.isEnabled)
      .map(stepInterfaceSelector(state)),
    currentStep: currentStep
      ? stepInterfaceSelector(state)(currentStep)
      : undefined,
    isStepPristine: currentStep
      ? getStepIsPristine(currentStep.name, state.fields)
      : true,
    isStepValid: currentStep
      ? getStepIsValid(currentStep.name, state.fields)
      : true,
    isStepValidating: currentStep
      ? getStepIsValidating(currentStep.name, state.fields)
      : false,
    isStepSubmitted: currentStep?.isSubmitted ?? false,
    isFirstStep: state.steps.at(0)?.name === currentStep?.name,
    isLastStep: state.steps.at(-1)?.name === currentStep?.name,
  };
};

export const stepInterfaceSelector = (state: Store) => (step: Step) => {
  return {
    name: step.name,
    label: step.label,
    isSubmitted: step.isSubmitted || state.form.isSubmitted,
    index: state.steps
      .filter((step) => step.isEnabled)
      .findIndex((s) => s.name === step.name),
    isCurrent: state.form.currentStepName === step.name,
    isValid: getStepIsValid(step.name, state.fields),
    isPristine: getStepIsPristine(step.name, state.fields),
    isValidating: getStepIsValidating(step.name, state.fields),
    isVisited: step.isVisited,
  };
};

export const fieldInterfaceSelector =
  <Value>(state: Store) =>
  (field: Field<Value>): ExposedFieldState<Value> => {
    const fieldStep = state.steps.find((step) => step.name === field.stepName);
    const errorMessages = [
      field.externalErrors.filter((message) => !!message),
      field.requiredErrors.filter((message) => !!message),
      field.validationsErrors.filter((message) => !!message),
      field.validationsAsyncErrors.filter((message) => !!message),
    ].flat();
    const isValid = getFieldIsValid(field);
    const isPristine = getFieldIsPristine(field);
    const isSubmitted = fieldStep
      ? fieldStep.isSubmitted
      : state.form.isSubmitted;
    const isProcessing = getFieldIsProcessing(field);
    return {
      value: field.value,
      formattedValue: field.formattedValue,
      id: `formiz${state.form.id ? `-${state.form.id}` : ""}-field-${
        field.name
      }__${field.id}`,
      isValid: isValid,
      shouldDisplayError:
        !isProcessing &&
        !isValid &&
        ((field.isTouched && !isPristine) || isSubmitted),
      isTouched: field.isTouched,
      errorMessages: errorMessages,
      errorMessage: errorMessages[0],
      isPristine: isPristine,
      isSubmitted: fieldStep ? fieldStep.isSubmitted : state.form.isSubmitted,
      isValidating: getFieldIsValidating(field),
      isDebouncing: getFieldIsDebouncing(field),
      isProcessing: getFieldIsProcessing(field),
      isReady: getFieldIsReady(field),
      resetKey: state.form.resetKey,
    };
  };

export const fieldExternalInterfaceSelector =
  <Value>(state: Store) =>
  (field: Field<Value>): ExposedExternalFieldState<Value> => {
    const { value, formattedValue, ...internalField } =
      fieldInterfaceSelector<Value>(state)(field);
    return {
      ...internalField,
      value: formattedValue,
      rawValue: value,
    };
  };
