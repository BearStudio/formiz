/* eslint-disable no-restricted-globals */
const testIsString = x => typeof x === 'string' || x instanceof String;
const testIsNumber = x => typeof x === 'number';
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

export const isNumber = () => value => testIsNumber(parseFloat(value))
  && !isNaN(parseFloat(value))
  && !isNaN(value);
