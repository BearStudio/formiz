import type {
  ExposedFieldState,
  ExposedExternalFieldState,
  Field,
  Step,
  Store,
  ResetOptions,
  DefaultFormValues,
  useFormProps,
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
  getStepIsValid,
  getStepIsPristine,
  getStepIsValidating,
  getFieldIsExternalProcessing,
  isFormStateSubscribed,
} from "@/utils/form";

export const formInterfaceSelector = <
  Values extends object = DefaultFormValues
>(
  state: Store<Values>,
  stateSubscription?: useFormProps<Values>["stateSubscription"]
): FormInterface<Values> => {
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

    collection: (fieldName) => ({
      setKeys: state.actions.setCollectionKeys(fieldName),
      set: state.actions.setCollectionValues(fieldName),
      insertMultiple: state.actions.insertMultipleCollectionValues(fieldName),
      insert: state.actions.insertCollectionValue(fieldName),
      append: state.actions.appendCollectionValue(fieldName),
      prepend: state.actions.prependCollectionValue(fieldName),
      removeMultiple: state.actions.removeMultipleCollectionValues(fieldName),
      remove: state.actions.removeCollectionValue(fieldName),
    }),

    ...isFormStateSubscribed("id", state.form.id, stateSubscription),
    ...isFormStateSubscribed(
      "resetKey",
      state.form.resetKey,
      stateSubscription
    ),
    ...isFormStateSubscribed("isReady", state.ready, stateSubscription),
    ...isFormStateSubscribed(
      "isSubmitted",
      state.form.isSubmitted,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isValid",
      getFormIsValid(state.fields),
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isValidating",
      getFormIsValidating(state.fields),
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isPristine",
      getFormIsPristine(state.fields),
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "steps",
      state.steps
        .filter((step) => step.isEnabled)
        .map(stepInterfaceSelector(state)),
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "currentStep",
      currentStep ? stepInterfaceSelector(state)(currentStep) : undefined,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isStepPristine",
      currentStep ? getStepIsPristine(currentStep.name, state.fields) : true,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isStepValid",
      currentStep ? getStepIsValid(currentStep.name, state.fields) : true,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isStepValidating",
      currentStep ? getStepIsValidating(currentStep.name, state.fields) : true,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isStepSubmitted",
      currentStep?.isSubmitted ?? false,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isFirstStep",
      state.steps[0]?.name === currentStep?.name,
      stateSubscription
    ),
    ...isFormStateSubscribed(
      "isLastStep",
      state.steps[state.steps.length - 1]?.name === currentStep?.name,
      stateSubscription
    ),
  };
};

export interface FormInterface<Values extends object = DefaultFormValues> {
  submit: Store<Values>["actions"]["submitForm"];
  setValues: Store<any>["actions"]["setValues"];
  setErrors: Store<any>["actions"]["setErrors"];
  getStepByFieldName: (fieldName: string) => StepInterface | undefined;
  reset: (options?: ResetOptions) => void;
  submitStep: Store<any>["actions"]["submitStep"];
  goToStep: Store<any>["actions"]["goToStep"];
  goToNextStep: Store<any>["actions"]["goToNextStep"];
  goToPreviousStep: Store<any>["actions"]["goToPreviousStep"];

  collection: (fieldName: string) => {
    setKeys: ReturnType<Store<any>["actions"]["setCollectionKeys"]>;
    set: ReturnType<Store<any>["actions"]["setCollectionValues"]>;
    insertMultiple: ReturnType<
      Store<any>["actions"]["insertMultipleCollectionValues"]
    >;
    insert: ReturnType<Store<any>["actions"]["insertCollectionValue"]>;
    append: ReturnType<Store<any>["actions"]["appendCollectionValue"]>;
    prepend: ReturnType<Store<any>["actions"]["prependCollectionValue"]>;
    removeMultiple: ReturnType<
      Store<any>["actions"]["removeMultipleCollectionValues"]
    >;
    remove: ReturnType<Store<any>["actions"]["removeCollectionValue"]>;
  };

  id?: Store<Values>["form"]["id"];
  resetKey?: Store<Values>["form"]["resetKey"];
  isReady?: Store<Values>["ready"];
  isSubmitted?: Store<Values>["form"]["isSubmitted"];
  isValid?: boolean;
  isValidating?: boolean;
  isPristine?: boolean;
  steps?: StepInterface[];
  currentStep?: StepInterface | undefined;
  isStepPristine?: boolean;
  isStepValid?: boolean;
  isStepValidating?: boolean;
  isStepSubmitted?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export const stepInterfaceSelector =
  <Values extends object = DefaultFormValues>(state: Store<Values>) =>
  (step: Step): StepInterface => {
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

export interface StepInterface {
  name: string;
  label: React.ReactNode;
  isSubmitted: boolean;
  index: number;
  isCurrent: boolean;
  isValid: boolean;
  isPristine: boolean;
  isValidating: boolean;
  isVisited: boolean;
}

export const fieldInterfaceSelector =
  <Value = unknown, FormattedValue = Value>(state: Store) =>
  (
    field: Field<Value, FormattedValue>
  ): ExposedFieldState<Value, FormattedValue> => {
    const fieldStep = state.steps.find((step) => step.name === field.stepName);
    const errorMessages = [
      field.externalErrors.filter((message) => !!message),
      field.requiredErrors.filter((message) => !!message),
      field.validationsErrors.filter((message) => !!message),
      field.validationsAsyncErrors.filter((message) => !!message),
    ].flat();
    const isValid = getFieldIsValid(field);
    const isPristine = getFieldIsPristine(field);
    const isSubmitted = fieldStep?.isSubmitted || state.form.isSubmitted;
    const isProcessing = getFieldIsProcessing(field, state.ready);
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
      isPristine,
      isSubmitted,
      isValidating: getFieldIsValidating(field),
      isExternalProcessing: getFieldIsExternalProcessing(field),
      isDebouncing: getFieldIsDebouncing(field),
      isProcessing,
      isReady: state.ready,
      resetKey: state.form.resetKey,
    };
  };

export const fieldExternalInterfaceSelector =
  <Value = unknown, FormattedValue = Value>(state: Store) =>
  (
    field: Field<Value, FormattedValue>
  ): ExposedExternalFieldState<Value, FormattedValue> => {
    const { value, formattedValue, ...internalField } = fieldInterfaceSelector<
      Value,
      FormattedValue
    >(state)(field);
    return {
      ...internalField,
      value: formattedValue,
      rawValue: value,
    };
  };
