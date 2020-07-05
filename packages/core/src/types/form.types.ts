import { RefObject } from 'react';
import { FieldValue, Field } from './field.types';
import { Step, StepState } from './step.types';

export interface FormState {
  id: string;
  resetKey: number;
  isSubmitted: boolean;
  isValid: boolean;
  isValidating: boolean;
  isPristine: boolean;
  steps: StepState[];
  initialStepName: null | string;
  navigatedStepName: null | string;
}

export type FormFields = Field[];

export type KeepValues = {
  [key: string]: FieldValue;
}

export type FormValues = any;

export interface FormContextValue {
  formStateRef?: React.RefObject<FormState>;
  fieldsRef?: React.RefObject<FormFields>;
  actions?: {
    updateStep(stepState: Partial<StepState>): void;
    unregisterStep(stepName: string): void;
    registerField(fieldState: Field): void;
    updateField(fieldState: Field): void;
    unregisterField(fieldState: Field, shouldKeepValue: boolean): void;
  };
  formMethods?: FormMethods;
  keepValuesRef?: RefObject<KeepValues>;
  subjects?: {
    onFormUpdate: any;
    onFieldsUpdate: any;
    onExternalFieldsUpdate: any;
    onReset: any;
  };
}

export interface FormMethods {
  submit?(values: FormValues): void;
  setFieldsValues?(objectOfValues: {
    [key: string]: FieldValue;
  }): void;
  invalidateFields?(objectOfErrors: {
    [key: string]: string;
  }): void;
  getFieldStepName?(fieldName: string): null | string;
  submitStep?(values: FormValues): void;
  goToStep?(stepName: string): void;
  nextStep?(): void;
  prevStep?(): void;
  reset?(): void;
  __connect__?(s: any): void;
}

export interface FormizProps {
  autoForm?: boolean;
  children?: React.ReactNode;
  connect?: any;
  id?: string;
  onChange?(values: object): void;
  onSubmit?(values: object): void;
  onValidSubmit?(values: object): void;
  onInvalidSubmit?(values: object): void;
  onValid?(): void;
  onInvalid?(): void;
}

interface SubscribeObject {
  form?: boolean;
  fields?: boolean | string[];
}
export interface UseFormProps {
  subscribe?: boolean | 'form' | 'fields' | SubscribeObject;
}

export interface UseFormValues {
  submit?(values: FormValues): void;
  setFieldsValues?(objectOfValues: {
    [key: string]: FieldValue;
  }): void;
  __connect__?(s: any): void;

  resetKey?: number;
  isSubmitted?: boolean;
  isValid?: boolean;
  isValidating?: boolean;
  isPristine?: boolean;

  steps?: Step[];
  currentStep?: {} | Step;
  isStepPristine?: boolean;
  isStepValid?: boolean;
  isStepValidating?: boolean;
  isStepSubmitted?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;

  values?: FormValues;
}
