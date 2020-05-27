
export type FieldValue = any; // eslint-disable-line

export interface FieldValidationObject {
  rule(value: FieldValue): boolean | Promise<boolean>;
  message?: string;
  deps?: any[];
}

export interface UseFieldProps {
  debounce?: number;
  defaultValue?: FieldValue;
  formatValue?(value: FieldValue): FieldValue;
  name: string;
  onChange?(value: FieldValue, rawValue: FieldValue): void;
  required?: boolean;
  validations?: FieldValidationObject[];
  keepValue?: boolean;
}

export interface Field {
  id: string;
  resetKey: number;
  name: string;
  errors: (string | undefined)[];
  externalErrors: string[];
  value: FieldValue;
  valueDebounced: FieldValue;
  isPristine: boolean;
  isEnabled: boolean;
  stepName?: string;
}

export interface FieldState {
  id: string;
  resetKey: number;
  errors: (string | undefined)[];
  externalErrors: string[];
  value: FieldValue;
  valueDebounced: FieldValue;
  isPristine: boolean;
  isEnabled: boolean;
}

export interface UseFieldValues {
  errorMessage?: string | undefined;
  errorMessages?: (string | undefined)[];
  id: string;
  isPristine: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  setValue(value: FieldValue): void;
  value: FieldValue;
  valueDebounced: FieldValue;
  resetKey: number;
}
