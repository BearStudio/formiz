/* eslint-disable no-restricted-globals */
/**
 * Check if the value is a string.
 * @param x The value to check.
 * @returns {boolean} true if the value is a string, false instead.
 */
const testIsString = x => typeof x === 'string' || x instanceof String;

/**
 * Check if the value is a number.
 * @param x The value to check.
 * @returns {boolean} true if the value is a number, false instead.
 */
const testIsNumber = x => typeof parseFloat(x) === 'number'
  && !isNaN(parseFloat(x))
  && !isNaN(x);
// const testIsObject = x => x && typeof x === 'object' && x.constructor === Object;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

/**
 * Check if the value exists.
 * @returns {function} function that accepte a value and
 * return true if the value exists, false instead.
 */
export const isRequired = () => value => !!value || value === 0;

/**
 * Check if the value is a string and is not empty.
 * @returns {function} function that accepte a value and
 * return true if the value is a string and is not empty, false instead.
 */
export const isNotEmptyString = () => (value) => {
  if (!testIsString(value)) return false;

  return !!(value || '').match(/^(?!\s*$).+/);
};

/**
 * Check if the value is an array and is not empty.
 * @returns {function} function that accepte a value and
 * return true if the value is an array and is not empty.
 */
export const isNotEmptyArray = () => (value) => {
  if (!Array.isArray(value)) return false;

  return !!(value || []).length;
};

/**
 * Check if the value is a valid email.
 * @returns {function} function that accepte a value and
 * return true if the value is null or undefined or is a valid email string,
 * false instead
 */
export const isEmail = () => (value) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (!testIsString(value)) return false;

  return !value || emailRegex.test(value);
};

/**
 * Check if the value is a number.
 * @returns {function} function that accepte a value and
 * return true if the value is a number, false instead.
 */
export const isNumber = () => value => testIsNumber(value);

/**
 * Check if the value is greater than the given minimum.
 * @param {number} min The minimum authorized value.
 * @returns {function} function that accepte a value and
 * return true if the value is a number and is greater than the minimum, false instead.
 */
export const isMinNumber = min => value => testIsNumber(value) && parseFloat(value) >= min;

/**
 * Check if the value is lower than the given maximum.
 * @param {number} max The maximum authorized value.
 * @returns {function} function that accepte a value and
 * return true if the value is a number and is lower than the maximum, false instead.
 */
export const isMaxNumber = max => value => testIsNumber(value) && parseFloat(value) <= max;

/**
 * Check if the value is between the minimum and the maximum.
 * @param {number} min The minimum authorized value.
 * @param {number} max The maximum authorized value.
 * @returns {function} function that accepte a value and
 * return true if the value is a number and is between the min and max, false instead.
 */
export const isInRangeNumber = (min, max) => value => testIsNumber(value)
  && parseFloat(value) >= min
  && parseFloat(value) <= max;

/**
 * Check if the value is a percentage, between 0 and 100.
 * @returns {function} function that accepte a value and
 * return true if the value is a number and is between 0 and 100, false instead.
 */
export const isPercentage = () => value => testIsNumber(value)
  && parseFloat(value) >= 0
  && parseFloat(value) <= 100;

/**
 * Check if the value has the given length.
 * @param {number} length The authorized length for the value.
 * @returns {function} function that accepte a value and
 * return true if the value is a string or an array and match the length, false instead.
 */
export const isLength = length => value => (testIsString(value) || Array.isArray(value))
  && value.length === length;

/**
 * Check if the value has a length greater than the given minimum.
 * @param {number} min The minimum authorized length.
 * @returns {function} function that accepte a value and
 * return true if the value is a string or an array with a length greater than the
 * given minimum, false instead.
 */
export const isMinLength = min => value => (testIsString(value) || Array.isArray(value))
  && value.length >= min;

/**
 * Check if the value has a length lower than the given maximum.
 * @param {number} max The maximum authorized length.
 * @returns {function} function that accepte a value and
 * return true if the value is a string or an array with a length lower than the
 * given maximum, false instead.
 */
export const isMaxLength = max => value => (testIsString(value) || Array.isArray(value))
  && value.length <= max;
