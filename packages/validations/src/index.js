/* eslint-disable no-restricted-globals */
const testIsString = x => typeof x === 'string' || x instanceof String;
const testIsNumber = x => typeof parseFloat(x) === 'number'
  && !isNaN(parseFloat(x))
  && !isNaN(x);
// const testIsObject = x => x && typeof x === 'object' && x.constructor === Object;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isRequired = () => value => !!value || value === 0;

export const isNotEmptyString = () => (value) => {
  if (!testIsString(value)) return false;

  return !!(value || '').match(/^(?!\s*$).+/);
};

export const isNotEmptyArray = () => (value) => {
  if (!Array.isArray(value)) return false;

  return !!(value || []).length;
};

export const isEmail = () => (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (!testIsString(value)) return false;

  return !value || emailRegex.test(value);
};

export const isNumber = () => value => testIsNumber(value);

export const isMinNumber = min => value => testIsNumber(value) && parseFloat(value) >= min;

export const isMaxNumber = max => value => testIsNumber(value) && parseFloat(value) <= max;

export const isLength = length => value => (testIsString(value) || Array.isArray(value))
  && value.length === length;

export const isMinLength = min => value => (testIsString(value) || Array.isArray(value))
  && value.length >= min;

export const isMaxLength = max => value => (testIsString(value) || Array.isArray(value))
  && value.length <= max;
