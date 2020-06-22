import PropTypes from 'prop-types';

export type FieldValue = any; // eslint-disable-line

export interface FieldValidationObject {
  rule(value: FieldValue): boolean;
  message?: string;
  deps?: any[];
}
export interface FieldAsyncValidationObject {
  rule(value: FieldValue): Promise<boolean>;
  message?: string;
  deps?: any[];
}

export interface UseFieldProps {
  name: string;
  debounce?: number;
  defaultValue?: FieldValue;
  formatValue?(value: FieldValue): FieldValue;
  onChange?(value: FieldValue, rawValue: FieldValue): void;
  required?: boolean;
  validations?: FieldValidationObject[];
  asyncValidations?: FieldAsyncValidationObject[];
  keepValue?: boolean;
}

export const fieldPropTypes = {
  name: PropTypes.string.isRequired,
  debounce: PropTypes.number,
  defaultValue: PropTypes.any,
  formatValue: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  validations: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.func,
    message: PropTypes.node,
    deps: PropTypes.arrayOf(PropTypes.any),
  })),
  asyncValidations: PropTypes.arrayOf(PropTypes.shape({
    rule: PropTypes.func,
    message: PropTypes.node,
    deps: PropTypes.arrayOf(PropTypes.any),
  })),
  keepValue: PropTypes.bool,
};

export const fieldDefaultProps: Omit<UseFieldProps, 'name'> = {
  debounce: 100,
  defaultValue: null,
  formatValue: (val: FieldValue): FieldValue => val,
  onChange: () => {},
  required: false,
  validations: [],
  asyncValidations: [],
  keepValue: false,
};

export interface Field {
  id: string;
  resetKey: number;
  name: string;
  errors: (string | undefined)[];
  asyncErrors: (string | undefined)[];
  externalErrors: string[];
  value: FieldValue;
  valueDebounced: FieldValue;
  isValidating: boolean;
  isPristine: boolean;
  isEnabled: boolean;
  stepName?: string;
}

export interface FieldState {
  id: string;
  resetKey: number;
  errors: (string | undefined)[];
  asyncErrors: (string | undefined)[];
  externalErrors: string[];
  value: FieldValue;
  valueDebounced: FieldValue;
  isValidating: boolean;
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
  isValidating: boolean;
  setValue(value: FieldValue): void;
  value: FieldValue;
  valueDebounced: FieldValue;
  resetKey: number;
}
