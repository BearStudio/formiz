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
  onChange?(value?: FieldValue, rawValue?: FieldValue): void;
  required?: boolean | string;
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
  validations: PropTypes.arrayOf(
    PropTypes.shape({
      rule: PropTypes.func,
      message: PropTypes.node,
      deps: PropTypes.arrayOf(PropTypes.any),
    }),
  ),
  asyncValidations: PropTypes.arrayOf(
    PropTypes.shape({
      rule: PropTypes.func,
      message: PropTypes.node,
      deps: PropTypes.arrayOf(PropTypes.any),
    }),
  ),
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

export interface FieldState {
  id: string;
  resetKey: number;
  errors: (string | undefined)[];
  asyncErrors: (string | undefined)[];
  externalErrors: string[];
  value: FieldValue;
  valueDebounced: FieldValue;
  isAsyncValidating: boolean;
  isExternalValidating: boolean;
  isPristine: boolean;
  isEnabled: boolean;
}
export interface Field extends FieldState {
  name: string;
  stepName?: string;
}

export interface ExposedField {
  errorMessage?: string | undefined;
  errorMessages?: (string | undefined)[];
  isPristine: boolean;
  isValid: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  value: FieldValue;
  valueDebounced: FieldValue;
  resetKey: number;
  id: string;
}

export interface UseFieldValues extends ExposedField {
  setValue(value: FieldValue | ((prevValue: FieldValue) => FieldValue)): void;
  validating: {
    start: () => void;
    end: () => void;
  },
  otherProps: any;
}
