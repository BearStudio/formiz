import {
  isNotEmptyString,
} from '../src/index';

describe('isNotEmptyString', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isNotEmptyString()(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isNotEmptyString()(undefined)).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isNotEmptyString()('')).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isNotEmptyString()('value')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isNotEmptyString()('   ')).toBe(false);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isNotEmptyString()(1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isNotEmptyString()(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isNotEmptyString()(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isNotEmptyString()(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isNotEmptyString()([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isNotEmptyString()({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isNotEmptyString()({})).toBe(false);
  });
});
