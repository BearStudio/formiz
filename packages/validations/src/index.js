const isString = x => typeof x === 'string' || x instanceof String;
// const isNumber = x => typeof x === 'number';
const isArray = x => Array.isArray(x);
// const isObject = x => x && typeof x === 'object' && x.constructor === Object;
const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isRequired = () => value => !!value || value === 0;

export const isNotEmptyString = () => (value) => {
  if (!isString(value)) return false;

  return !!(value || '').match(/^(?!\s*$).+/);
};

export const isNotEmptyArray = () => (value) => {
  if (!isArray(value)) return false;

  return !!(value || []).length;
};

export const isEmail = () => (value) => {
  if (!isString(value)) return false;

  return !value || emailRegex.test(value);
};
