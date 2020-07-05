/* eslint-disable no-restricted-globals */
type Value = any;

/**
 * Check if the value is a string.
 */
const testIsString = (value: Value): boolean => typeof value === 'string' || value instanceof String;

/**
 * Check if the value is a number.
 */
const testIsNumber = (value: Value): boolean => typeof parseFloat(value) === 'number'
  && !isNaN(parseFloat(value))
  && !isNaN(value);

/**
 * Check if the value is null or undefined.
 */
const testIsNullOrUndefined = (value: Value): boolean => value === null || value === undefined;

/**
 * Check if the value is empty.
 */
const testIsEmpty = (value: Value): boolean => value === '' || testIsNullOrUndefined(value);

// const testIsObject = x => x && typeof x === 'object' && x.constructor === Object;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

/**
 * Check if the value exists.
 * @returns {function} function that accept a value and
 * return true if the value exists, false instead.
 */
export const isRequired = () => (value: Value): boolean => !!value || value === 0;

/**
 * Check if the value is a string and is not empty.
 */
export const isNotEmptyString = () => (value: Value): boolean => {
  if (testIsEmpty(value)) return true;
  if (!testIsString(value)) return false;

  return !!(value || '').match(/^(?!\s*$).+/);
};

/**
 * Check if the value is an array and is not empty.
 */
export const isNotEmptyArray = () => (value: Value): boolean => {
  if (testIsEmpty(value)) return true;
  if (!Array.isArray(value)) return false;

  return !!(value || []).length;
};

/**
 * Check if the value is a valid email.
 */
export const isEmail = () => (value: Value): boolean => {
  if (testIsEmpty(value)) return true;
  if (!testIsString(value)) return false;

  return !value || emailRegex.test(value);
};

/**
 * Check if the value is a number.
 */
export const isNumber = () => (value: Value): boolean => testIsEmpty(value) || testIsNumber(value);

/**
 * Check if the value is greater than the given minimum.
 */
export const isMinNumber = (min: number) => (value: Value): boolean => testIsEmpty(value)
  || (testIsNumber(value) && parseFloat(value) >= min);

/**
 * Check if the value is lower than the given maximum.
 */
export const isMaxNumber = (max: number) => (value: Value): boolean => testIsEmpty(value)
  || (testIsNumber(value) && parseFloat(value) <= max);

/**
 * Check if the value is between the minimum and the maximum.
 */
export const isInRangeNumber = (min: number, max: number) => (value: Value): boolean => (
  testIsEmpty(value)
  || (testIsNumber(value)
    && parseFloat(value) >= min
    && parseFloat(value) <= max
  ));

/**
 * Check if the value is a percentage, between 0 and 100.
 */
export const isPercentage = () => (value: Value): boolean => testIsEmpty(value) || (
  testIsNumber(value)
  && parseFloat(value) >= 0
  && parseFloat(value) <= 100
);

/**
 * Check if the value has the given length.
 */
export const isLength = (length: number) => (value: Value): boolean => {
  if (testIsEmpty(value)) return true;

  return (testIsString(value) || Array.isArray(value))
    && value.length === length;
};

/**
 * Check if the value has a length greater than the given minimum.
 */
export const isMinLength = (min: number) => (value: Value): boolean => {
  if (testIsEmpty(value)) return true;

  return (testIsString(value) || Array.isArray(value)) && value.length >= min;
};

/**
 * Check if the value has a length lower than the given maximum.
 */
export const isMaxLength = (max: number) => (value: Value): boolean => testIsEmpty(value) || ((
  testIsString(value) || Array.isArray(value)
) && value.length <= max);
