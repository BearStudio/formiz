import { FormInterface } from "@/selectors";
import { useForm } from "@/useForm";
import { useFormContext } from "@/useFormContext";
import React, { FormEvent, RefObject } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export type FieldValue<Value = unknown> = Value | null;
export type ErrorMessage = string | undefined;
export type FormatValue<Value = unknown, FormattedValue = unknown> = (
  value: FieldValue<Value>
) => FormattedValue;
export type OnValueChange<Value = unknown, FormattedValue = Value> = (
  value?: FieldValue<Value>,
  formattedValue?: FieldValue<FormattedValue>
) => void;

export type DefaultFormValues = any;

export type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

export interface FieldValidation<Value = unknown, FormattedValue = Value> {
  /**
   * Function that determines if the value is valid.
   * @param value the value as presents in form values.
   * @param rawValue the value before formatting.
   */
  handler(value?: FormattedValue, rawValue?: FieldValue<Value>): boolean;
  /**
   * Message if the validation is not respected.
   */
  message?: ErrorMessage;
  /**
   * The handler will be retrigger on each deps update.
   */
  deps?: unknown[];
  /**
   * Pass to true to also check that the value is not falsy. Default is false.
   */
  checkFalsy?: boolean;
}

export interface FieldValidationAsync<Value = unknown, FormattedValue = Value> {
  /**
   * Function that determines if the value is valid.
   * @param value the value as presents in form values.
   * @param rawValue the value before formatting.
   */
  handler(
    value?: FieldValue<FormattedValue>,
    rawValue?: FieldValue<Value>
  ): Promise<boolean>;
  /**
   * Message if the validation is not respected.
   */
  message?: ErrorMessage;
  /**
   * The handler will be retrigger on each deps update.
   */
  deps?: unknown[];
  /**
   * Pass to true to also check that the value is not falsy. Default is false.
   */
  checkFalsy?: boolean;
}

export interface Field<Value = unknown, FormattedValue = Value> {
  /**
   * Id of field.
   */
  id: string;
  /**
   * Name of the field.
   */
  name: string;
  /**
   * Raw value of the field, before formatting.
   */
  value: FieldValue<Value>;
  /**
   * Formatted value of the field, as presents in form values.
   */
  formattedValue: FieldValue<FormattedValue>;
  /**
   * Default value of the field, the one give when field is registered.
   */
  defaultValue: FieldValue<Value>;
  /**
   * Function to format value of the field between component value and form values.
   */
  formatValue: FormatValue;
  /**
   * The name of the name where the field is define, if it is in a step.
   */
  stepName?: string;
  /**
   * True if the value of the field never change, false otherwise.
   */
  isPristine: boolean;
  /**
   * True if the component of the field has been touched, false otherwise.
   */
  isTouched: boolean;
  /**
   * True if the field is executing async validations, false otherwise.
   */
  isValidating: boolean;
  /**
   * True if the field is debouncing before async validations, false otherwise.
   */
  isDebouncing: boolean;
  /**
   * True if the field has external processing in progress, false otherwise.
   */
  isExternalProcessing: boolean;
  /**
   * Array of field's invalids async validations errors messages.
   */
  validationsAsyncErrors: ErrorMessage[];
  /**
   * Array of field's invalids validations errors messages.
   */
  validationsErrors: ErrorMessage[];
  /**
   * Array of field's invalids requires validations.
   */
  requiredErrors: ErrorMessage[];
  /**
   * Array of field's invalids externals validations.
   */
  externalErrors: ErrorMessage[];
  /**
   * Reference of required value.
   */
  requiredRef?: React.MutableRefObject<
    FieldProps<Value, FormattedValue>["required"]
  >;
  /**
   * Reference of validations value.
   */
  validationsRef?: React.MutableRefObject<
    FieldProps<Value, FormattedValue>["validations"]
  >;
}

export interface ExposedFieldState<Value = unknown, FormattedValue = Value>
  extends Pick<
    Field<Value, FormattedValue>,
    | "id"
    | "formattedValue"
    | "isPristine"
    | "isTouched"
    | "isValidating"
    | "isExternalProcessing"
    | "isDebouncing"
  > {
  value: FieldValue<Value> | undefined;
  /**
   * True if the form has been submitted.
   */
  isSubmitted: boolean;
  /**
   * True if the something is in progress on the field (debouncing, validating, external processing), or if the form is not ready yet.
   */
  isProcessing: boolean;
  /**
   * True if the form is ready.
   */
  isReady: boolean;
  /**
   * True if every validations of the field are valid.
   */
  isValid: boolean;
  /**
   * True if the error message should be display (if field is invalid, not processing and it is touched and updated or if form has been submitted).
   */
  shouldDisplayError: boolean;
  /**
   * Array of field's every invalids validations.
   */
  errorMessages: ErrorMessage[];
  /**
   * The error message to display.
   */
  errorMessage: ErrorMessage;
  /**
   * A key updated on every form reset.
   */
  resetKey: number;
}

export interface ExposedExternalFieldState<
  Value = unknown,
  FormattedValue = Value
> extends Omit<
    ExposedFieldState<Value, FormattedValue>,
    "value" | "formattedValue"
  > {
  /**
   * Value of the field before formatting.
   */
  rawValue: FieldValue<Value> | undefined;
  /**
   * Value of the field after formatting, as presents on form values.
   */
  value: FieldValue<FormattedValue> | undefined;
}

export interface ExposedField<Value, FormattedValue, Props>
  extends ExposedFieldState<Value, FormattedValue> {
  /**
   * True if the field has a required validation.
   */
  isRequired: boolean;
  /**
   * Function to update field value.
   * @param fieldValue option 1: New value for the field.
   * @param fieldValue option 2: function with old field value as param.
   */
  setValue: (
    fieldValue:
      | FieldValue<Value>
      | ((oldValue: FieldValue<Value> | undefined) => FieldValue<Value>)
  ) => void;
  /**
   * Function to update isTouched field state.
   * @param isTouched New value for isTouched state.
   */
  setIsTouched: (isTouched: boolean) => void;
  /**
   * Contains functions to update isExternalProcessing field state.
   */
  externalProcessing: {
    /**
     * Function to set isExternalProcessing to true.
     */
    start: () => void;
    /**
     * Function to set isExternalProcessing to false.
     */
    end: () => void;
  };
  /**
   * All others props unused by Formiz.
   */
  otherProps: Omit<Props, keyof FieldProps<Value, FormattedValue>>;
}

export type PartialField<Value> = Partial<Omit<Field<Value>, "id">>;

export type Fields = Map<string, Field<unknown>>;

export type CollectionKey = string;

export type FormizCollection = {
  isPristine: boolean;
  keys: CollectionKey[];
  name: string;
};

export type Collections = Map<string, FormizCollection>;

export interface Step {
  /**
   * Name of the step.
   */
  name: string;
  /**
   * Label of the step.
   */
  label?: React.ReactNode;
  /**
   * True if the step has been submitted, false otherwise.
   */
  isSubmitted: boolean;
  /**
   * True if the step has been visited, false otherwise.
   */
  isVisited: boolean;
  /**
   * Order of the step.
   */
  order: number;
  /**
   * True if the step is enabled, false otherwise.
   */
  isEnabled: boolean;
}

export type PartialStep = Partial<Omit<Step, "name">>;

export type GetFieldSetValueOptions<Value, FormattedValue> = {
  fieldId: string;
  formatValue: FormatValue<Value, FormattedValue>;
  onValueChange: OnValueChange<Value, FormattedValue>;
};

export type ResetElement =
  | "pristine"
  | "submitted"
  | "touched"
  | "validating"
  | "debouncing"
  | "resetKey"
  | "currentStep"
  | "visited"
  | "values";

export type ResetOptions =
  | { only: ResetElement[]; exclude?: never }
  | { exclude: ResetElement[]; only?: never };

export type StoreInitialState<Values extends object = DefaultFormValues> = {
  ready?: boolean;
  form?: Partial<Store<Values>["form"]>;
} & Partial<Pick<Store<Values>, "initialValues" | "formConfigRef">>;

export type SetValuesOptions = { keepPristine?: boolean };

export type CollectionActionProps =
  | { collectionId: string; collectionName?: never }
  | { collectionId?: never; collectionName: string };

export interface Store<Values extends object = DefaultFormValues> {
  ready: boolean;
  connected: boolean;
  fields: Fields;
  collections: Collections;
  steps: Step[];
  form: {
    resetKey: number;
    id?: string;
    currentStepName: string | null;
    initialStepName: string | null;
    isSubmitted: boolean;
  };
  keepValues: NullablePartial<Values>;
  externalValues: NullablePartial<Values>;
  initialValues: NullablePartial<Values>;
  resetDefaultValues: NullablePartial<Values>;
  defaultValues: NullablePartial<Values>;
  formConfigRef: RefObject<useFormProps<Values>>;
  actions: {
    updateConfig(formConfigRef: RefObject<useFormProps<Values>>): void;
    updateReady(
      ready: boolean,
      formConfigRef: RefObject<useFormProps<Values>>
    ): void;
    updateConnected(
      connected: boolean,
      connectRef?: RefObject<FormizProps["connect"]>
    ): void;
    submitForm(e?: FormEvent): void;
    setValues(
      newValues: NullablePartial<Values>,
      options?: SetValuesOptions
    ): void;
    setDefaultValues(defaultValues: NullablePartial<Values>): void;
    setErrors(
      errors: Partial<
        Record<keyof Values extends string ? keyof Values : never, string>
      >
    ): void;
    reset(options?: ResetOptions): void;

    registerField<Value = unknown, FormattedValue = Value>(
      fieldId: string,
      newField: PartialField<Value> &
        Pick<Field<Value, FormattedValue>, "name">,
      options?: {
        defaultValue?: FieldValue<Value>;
        formatValue?: FormatValue<Value, FormattedValue>;
        requiredRef?: React.MutableRefObject<
          FieldProps<Value, FormattedValue>["required"]
        >;
        validationsRef?: React.MutableRefObject<
          FieldValidation<Value, FormattedValue>[]
        >;
      }
    ): void;
    unregisterField(
      fieldId: string,
      options?: {
        persist?: boolean;
        keepValueRef?: React.MutableRefObject<boolean>;
      }
    ): void;
    updateField<Value>(fieldId: string, newField: PartialField<Value>): void;
    getFieldSetValue<Value, FormattedValue>(
      options: GetFieldSetValueOptions<Value, FormattedValue>
    ): (fieldValue: FieldValue<Value> | ((oldValue: Value) => Value)) => void;
    getFieldSetIsTouched(fieldId: string): (isTouched: boolean) => void;

    submitStep(e?: FormEvent): void;
    registerStep(stepName: string, options?: PartialStep): void;
    updateStep(stepName: string, newStep: PartialStep): void;
    unregisterStep(stepName: string): void;
    goToStep(stepName: string): void;
    goToNextStep(): void;
    goToPreviousStep(): void;

    registerCollection(
      collectionId: string,
      newCollection: { name: string; defaultValues?: unknown[] }
    ): void;
    unregisterCollection(collectionId: string): void;

    setCollectionKeys(
      props: CollectionActionProps
    ): (
      keys: CollectionKey[] | ((oldKeys: CollectionKey[]) => CollectionKey[]),
      options?: SetValuesOptions
    ) => void;
    setCollectionValues(
      props: CollectionActionProps
    ): (values: unknown[], options?: SetValuesOptions) => void;
    insertMultipleCollectionValues(
      props: CollectionActionProps
    ): (index: number, values?: unknown[], options?: SetValuesOptions) => void;
    insertCollectionValue(
      props: CollectionActionProps
    ): (index: number, value?: unknown, options?: SetValuesOptions) => void;
    prependCollectionValue(
      props: CollectionActionProps
    ): (value: unknown, options?: SetValuesOptions) => void;
    appendCollectionValue(
      props: CollectionActionProps
    ): (value: unknown, options?: SetValuesOptions) => void;
    removeMultipleCollectionValues(
      props: CollectionActionProps
    ): (indexes: number[], options?: SetValuesOptions) => void;
    removeCollectionValue(
      props: CollectionActionProps
    ): (index: number, options?: SetValuesOptions) => void;
  };
}

export type FormStateElement = Extract<
  keyof FormInterface,
  | "id"
  | "resetKey"
  | "isReady"
  | "isSubmitted"
  | "isValid"
  | "isValidating"
  | "isPristine"
  | "steps"
  | "currentStep"
  | "isStepPristine"
  | "isStepValid"
  | "isStepValidating"
  | "isStepSubmitted"
  | "isFirstStep"
  | "isLastStep"
>;

export interface useFormProps<Values extends object = DefaultFormValues> {
  /**
   * Id of the form.
   */
  id?: string;
  /**
   * InitialValues of the form.
   */
  initialValues?: NullablePartial<Values>;
  /**
   * Name of the initial step to display.
   */
  initialStepName?: string;
  /**
   * True if the form is ready to be setup, false otherwise. (useful with async initialValues)
   */
  ready?: boolean;
  /**
   * Function triggered on every form values change.
   */
  onValuesChange?(values: Values, form: FormInterface<any>): void;
  /**
   * Function triggered on form submit.
   */
  onSubmit?(values: Values, form: FormInterface<any>): void;
  /**
   * Function triggered on form submit if all fields are valid.
   */
  onValidSubmit?(values: Values, form: FormInterface<any>): void;
  /**
   * Function triggered on form submit if some field is invalid.
   */
  onInvalidSubmit?(values: Values, form: FormInterface<any>): void;
  /**
   * Function triggered when form becomes valid.
   */
  onValid?(form: FormInterface<any>): void;
  /**
   * Function triggered when form becomes invalid.
   */
  onInvalid?(form: FormInterface<any>): void;
  /**
   * States to select or to exclude from form subscription
   */
  stateSubscription?:
    | { only: Array<FormStateElement>; exclude?: never }
    | { exclude: Array<FormStateElement>; only?: never };
}

export interface FormizProps {
  /**
   * Formiz form to connect to form context.
   */
  connect: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  /**
   * True to automatically add an html form to manage form submit. "form" do the same. "step" to automatically manage step submit.
   */
  autoForm?: boolean | "form" | "step";
  children?: React.ReactNode;
}

export interface FormizProviderProps {
  children: React.ReactNode;
}

export interface FormizStepProps extends Pick<Step, "name" | "label"> {
  /**
   * Component to use as step container. Default is "div".
   */
  as?: any;
  children?: React.ReactNode;
  /**
   * True to enabled step, false to disable. Default is true.
   */
  isEnabled?: boolean;
  /**
   * Determines order of display of the step, compared to others.
   */
  order?: number;
  /**
   * Style for the step container.
   */
  style?: React.CSSProperties;
  /**
   * True to hide by default the step, false to not hide it. Default is true.
   */
  autoHide?: boolean;
}

export interface FieldProps<Value = unknown, FormattedValue = Value>
  extends Pick<Field<Value, FormattedValue>, "name"> {
  /**
   * Default value of the field, the one give when field is registered.
   */
  defaultValue?: FieldValue<Value>;
  /**
   * Function to format value of the field between component value and form values.
   */
  formatValue?: FormatValue<Value, FormattedValue>;
  /**
   * Function trigger on each value update.
   */
  onValueChange?: OnValueChange<Value, FormattedValue>;
  /**
   * True if the field is required, false otherwise. Pass a string to determines error message if the validation is invalid.
   */
  required?: boolean | string;
  /**
   * An array of validations for the field.
   */
  validations?: FieldValidation<Value, FormattedValue>[];
  /**
   * An array of async validations for the field.
   */
  validationsAsync?: FieldValidationAsync<Value, FormattedValue>[];
  /**
   * Debounce duration before trigger async validations handler.
   */
  debounceValidationsAsync?: number;
  /**
   * True to keep the value of the field even if the field is unmounted. Default is false.
   */
  keepValue?: boolean;
}

export interface UseFieldConfig<Value = unknown, FormattedValue = Value>
  extends Pick<
    FieldProps<Value, FormattedValue>,
    | "formatValue"
    | "required"
    | "validations"
    | "validationsAsync"
    | "debounceValidationsAsync"
  > {
  unstable_notifyOnChangePropsExclusions?: (keyof ExposedFieldState<
    Value,
    FormattedValue
  >)[];
}

export type Form<Values extends object = DefaultFormValues> = ReturnType<
  typeof useForm<Values>
>;

export type FormContext<Values extends object = DefaultFormValues> = ReturnType<
  typeof useFormContext<Values>
>;
