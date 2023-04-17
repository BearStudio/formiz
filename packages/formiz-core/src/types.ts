import React, { FormEvent, RefObject } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export type FieldValue<Value = unknown> = Value | null;
export type Values = Record<string, unknown>;
export type ErrorMessage = string | undefined;
export type FormatValue<Value = unknown, FormattedValue = Value> = (
  value: FieldValue<Value>
) => FormattedValue;
export type OnValueChange<Value, FormattedValue = unknown> = (
  value?: FieldValue<Value>,
  formattedValue?: FieldValue<FormattedValue>
) => void;

export type FieldValidationObject<Value, FormattedValue = unknown> = {
  handler(
    value?: FieldValue<FormattedValue>,
    rawValue?: FieldValue<Value>
  ): boolean;
  message?: ErrorMessage;
  deps?: unknown[];
  checkFalsy?: boolean;
};

export type FieldValidationAsyncObject<Value, FormattedValue = unknown> = {
  handler(
    value?: FieldValue<FormattedValue>,
    rawValue?: FieldValue<Value>
  ): Promise<boolean>;
  message?: ErrorMessage;
  deps?: unknown[];
  checkFalsy?: boolean;
};

export type Field<Value, FormattedValue = unknown> = {
  id: string;
  name: string;
  value: FieldValue<Value>;
  formattedValue: FormattedValue | FieldValue<Value>;
  defaultValue: FieldValue<Value>;
  formatValue: FormatValue;
  stepName?: string;
  isPristine: boolean;
  isTouched: boolean;
  isValidating: boolean;
  isDebouncing: boolean;
  isExternalProcessing: boolean;
  validationsAsyncErrors: ErrorMessage[];
  validationsErrors: ErrorMessage[];
  requiredErrors: ErrorMessage[];
  externalErrors: ErrorMessage[];
  requiredRef?: React.MutableRefObject<FieldProps<Value>["required"]>;
  validationsRef?: React.MutableRefObject<FieldProps<Value>["validations"]>;
};

export type ExposedFieldState<Value, FormattedValue = unknown> = {
  id: string;
  value: FieldValue<Value>;
  formattedValue: FieldValue<FormattedValue>;
  isPristine: boolean;
  isTouched: boolean;
  isValidating: boolean;
  isExternalProcessing: boolean;
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

export type ExposedExternalFieldState<Value, FormattedValue = unknown> = Omit<
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
  externalProcessing: {
    start: () => void;
    end: () => void;
  };
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

export type StoreInitialState = {
  ready?: boolean;
  form?: Partial<Store["form"]>;
} & Partial<Pick<Store, "initialValues" | "formConfigRef">>;

export interface Store {
  ready: boolean;
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
  formConfigRef: RefObject<useFormProps>;
  actions: {
    setReady(initialState?: Omit<StoreInitialState, "ready">): void;
    submitForm(e?: FormEvent): void;
    setValues(newValues: Values, options?: { keepPristine?: boolean }): void;
    setErrors(errors: Record<string, unknown>): void;
    reset(options?: ResetOptions): void;
    resetInitialValues(): void;

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
    unregisterField(
      fieldId: string,
      options?: {
        persist?: boolean;
        keepValueRef?: React.MutableRefObject<boolean>;
      }
    ): void;
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

export interface useFormProps<Values = unknown> {
  id?: string;
  initialValues?: Partial<Values>;
  initialStepName?: string;
  ready?: boolean;
  onValuesChange?(values: Values): void;
  onSubmit?(values: Values): void;
  onValidSubmit?(values: Values): void;
  onInvalidSubmit?(values: Values): void;
  onValid?(): void;
  onInvalid?(): void;
}

export interface FormizProps {
  connect: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  autoForm?: boolean | "form" | "step";
  children?: React.ReactNode;
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

export type FieldProps<Value, FormattedValue = Value> = {
  name: string;
  defaultValue?: FieldValue<Value>;
  formatValue?: FormatValue<Value, FormattedValue>;
  onValueChange?: OnValueChange<Value, FormattedValue>;
  required?: boolean | string;
  validations?: FieldValidationObject<Value, FormattedValue>[];
  validationsAsync?: FieldValidationAsyncObject<Value, FormattedValue>[];
  debounceValidationsAsync?: number;
  keepValue?: boolean;
};

export interface UseFieldConfig<Value, FormattedValue = unknown> {
  unstable_notifyOnChangePropsExclusions?: (keyof ExposedFieldState<
    Value,
    FormattedValue
  >)[];
  formatValue?: FormatValue<Value, FormattedValue>;
  required?: boolean | string;
  validations?: FieldValidationObject<Value, FormattedValue>[];
  validationsAsync?: FieldValidationAsyncObject<Value, FormattedValue>[];
  debounceValidationsAsync?: number;
}
