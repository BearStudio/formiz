import React, { FormEvent, RefObject } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export type FieldValue<Value extends unknown = unknown> = Value | null;
export type Values = Record<string, unknown>;
export type ErrorMessage = string | undefined;
export type FormatValue<
  Value extends unknown = unknown,
  FormattedValue extends unknown = unknown
> = (value: FieldValue<Value>) => FieldValue<FormattedValue>;
export type OnValueChange<Value, FormattedValue extends unknown = unknown> = (
  value?: FieldValue<Value>,
  formattedValue?: FieldValue<FormattedValue>
) => void;

export type FieldValidationObject<
  Value,
  FormattedValue extends unknown = unknown
> = {
  handler(
    value?: FieldValue<FormattedValue>,
    rawValue?: FieldValue<Value>
  ): boolean;
  message?: ErrorMessage;
  deps?: unknown[];
  checkFalsy?: boolean;
};

export type FieldValidationAsyncObject<
  Value,
  FormattedValue extends unknown = unknown
> = {
  handler(
    value?: FieldValue<FormattedValue>,
    rawValue?: FieldValue<Value>
  ): Promise<boolean>;
  message?: ErrorMessage;
  deps?: unknown[];
  checkFalsy?: boolean;
};

export type Field<Value, FormattedValue extends unknown = unknown> = {
  id: string;
  name: string;
  value: FieldValue<Value>;
  formattedValue: FormattedValue | FieldValue<Value>;
  initialValue: FieldValue<Value>;
  initialFormattedValue: FormattedValue | FieldValue<Value>;
  stepName?: string;
  isPristine: boolean;
  isTouched: boolean;
  isValidating: boolean;
  isDebouncing: boolean;
  validationsAsyncErrors: ErrorMessage[];
  validationsErrors: ErrorMessage[];
  requiredErrors: ErrorMessage[];
  externalErrors: ErrorMessage[];
  requiredRef?: React.MutableRefObject<FieldProps<Value>["required"]>;
  validationsRef?: React.MutableRefObject<FieldProps<Value>["validations"]>;
};

export type ExposedFieldState<
  Value,
  FormattedValue extends unknown = unknown
> = {
  id: string;
  value: FieldValue<Value>;
  formattedValue: FieldValue<FormattedValue>;
  isPristine: boolean;
  isTouched: boolean;
  isValidating: boolean;
  isDebouncing: boolean;
  isSubmitted: boolean;
  isProcessing: boolean;
  isReady: boolean;
  isValid: boolean;
  shouldDisplayError: boolean;
  errorMessages: ErrorMessage[];
  errorMessage: ErrorMessage;
  resetKey: number;
};

export type ExposedExternalFieldState<
  Value,
  FormattedValue extends unknown = unknown
> = Omit<
  ExposedFieldState<Value, FormattedValue>,
  "value" | "formattedValue"
> & {
  rawValue: FieldValue<Value>;
  value: FieldValue<FormattedValue>;
};

export type ExposedField<Value, Props> = ExposedFieldState<Value> & {
  isRequired: boolean;
  setValue: (
    fieldValue:
      | FieldValue<Value>
      | ((oldValue: FieldValue<Value>) => FieldValue<Value>)
  ) => void;
  setIsTouched: (isTouched: boolean) => void;
  otherProps: Omit<Props, keyof FieldProps<Value>>;
};

export type PartialField<Value> = Partial<Omit<Field<Value>, "id">>;

export type Fields = Map<string, Field<unknown>>;

export interface Step {
  name: string;
  label?: React.ReactNode;
  isSubmitted: boolean;
  isVisited: boolean;
  order: number;
  isEnabled: boolean;
}

export type PartialStep = Partial<Omit<Step, "name">>;

export type GetFieldSetValueOptions<Value> = {
  fieldId: string;
  formatValue: FormatValue<Value>;
  onValueChange: OnValueChange<Value>;
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

export type ResetOptions = { only?: ResetElement[]; exclude?: ResetElement[] };

export interface Store {
  connected: boolean;
  fields: Fields;
  steps: Step[];
  form: {
    resetKey: number;
    id?: string;
    currentStepName: string | null;
    initialStepName: string | null;
    isSubmitted: boolean;
  };
  keepValues: Partial<Values>;
  externalValues: Partial<Values>;
  initialValues: Partial<Values>;
  formPropsRef: RefObject<FormizProps>;
  actions: {
    submitForm(e?: FormEvent): void;
    setValues(newValues: Values, options?: { keepPristine?: boolean }): void;
    setErrors(errors: Record<string, unknown>): void;
    reset(options?: ResetOptions): void;

    getFieldValidationsErrors<Value>(
      value: Value,
      formattedValue: Value,
      required: FieldProps<Value>["required"],
      validations: FieldProps<Value>["validations"]
    ): { requiredErrors: ErrorMessage[]; validationsErrors: ErrorMessage[] };

    registerField<Value>(
      fieldId: string,
      newField: PartialField<Value> & Pick<Field<Value>, "name">,
      options?: {
        defaultValue?: FieldValue<Value>;
        formatValue?: FormatValue<Value>;
        requiredRef?: React.MutableRefObject<FieldProps<Value>["required"]>;
        validationsRef?: React.MutableRefObject<FieldValidationObject<Value>[]>;
      }
    ): void;
    unregisterField(fieldId: string, options?: { persist?: boolean }): void;
    updateField<Value>(fieldId: string, newField: PartialField<Value>): void;
    getFieldSetValue<Value>(
      options: GetFieldSetValueOptions<Value>
    ): (fieldValue: FieldValue<Value> | ((oldValue: Value) => Value)) => void;
    getFieldSetIsTouched(fieldId: string): (isTouched: boolean) => void;

    submitStep(e?: FormEvent): void;
    registerStep(stepName: string, options?: PartialStep): void;
    updateStep(stepName: string, newStep: PartialStep): void;
    unregisterStep(stepName: string): void;
    goToStep(stepName: string): void;
    goToNextStep(): void;
    goToPreviousStep(): void;
  };
}

export interface FormizProps {
  autoForm?: boolean | "form" | "step";
  children?: React.ReactNode;
  initialValues?: Values;
  initialStepName?: string;
  id?: string;
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  onValuesChange?(values: Values): void;
  onSubmit?(values: Values): void;
  onValidSubmit?(values: Values): void;
  onInvalidSubmit?(values: Values): void;
  onValid?(): void; // TODO: Keep? if not kept, just remove useIsValidChange in Formiz.tsx (and use on examples and doc)
  onInvalid?(): void; // TODO: Keep? if not kept, just remove useIsValidChange in Formiz.tsx (and use on examples and doc)
}

export interface FormizProviderProps {
  children: React.ReactNode;
}

export interface FormizStepProps {
  as?: any;
  name: string;
  label?: string;
  children?: React.ReactNode;
  isEnabled?: boolean;
  order?: number;
  style?: React.CSSProperties;
  autoHide?: boolean;
}

export type FieldProps<Value> = {
  name: string;
  defaultValue?: FieldValue<Value>;
  formatValue?: FormatValue<Value>;
  onValueChange?: OnValueChange<Value>;
  required?: boolean | string;
  validations?: FieldValidationObject<Value>[];
  validationsAsync?: FieldValidationAsyncObject<Value>[];
  debounceValidationsAsync?: number;
  // keepValue?: boolean; // TODO: Keep?
};

export interface UseFieldConfig<Value> {
  unstable_notifyOnChangePropsExclusions?: (keyof ExposedFieldState<Value>)[];
  formatValue?: FormatValue<Value>;
  required?: boolean | string;
  validations?: FieldValidationObject<Value>[];
  validationsAsync?: FieldValidationAsyncObject<Value>[];
  debounceValidationsAsync?: number;
}
