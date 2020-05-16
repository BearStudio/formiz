import { RefObject } from 'react';
import { Subject } from 'rxjs';
import { FieldValue, Field } from './field.types';
import { Step, StepState } from './step.types';

export interface FormState {
  resetKey: number;
  isSubmitted: boolean;
  isValid: boolean;
  isPristine: boolean;
  steps: Array<StepState>;
  initialStepName: null | string;
  navigatedStepName: null | string;
}

export type FormFields = Array<Field>;

export type KeepValues = {
  [key: string]: FieldValue;
}

export type FormValues = any;

export interface FormContextValue {
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
    onFormUpdate: Subject<any>;
    onFieldsUpdate: Subject<any>;
    onExternalFieldsUpdate: Subject<any>;
    onReset: Subject<any>;
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
  onChange?(values: object): void;
  onSubmit?(values: object): void;
  onValidSubmit?(values: object): void;
  onInvalidSubmit?(values: object): void;
  onValid?(): void;
  onInvalid?(): void;
}

export interface UseFormProps {
  stateLevel?: 'none' | 'form' | 'fields';
  debounceValues?: number;
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
  isPristine?: boolean;

  steps?: Array<Step>;
  currentStep?: {} | Step;
  isStepValid?: boolean;
  isStepSubmitted?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;

  values?: FormValues;
}
