import {
  isNotEmptyArray,
} from '../index';

describe('isNotEmptyArray', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isNotEmptyArray()(null)).toBe(false);
  });

  it('Test if value is undefined', () => {
    expect(isNotEmptyArray()(undefined)).toBe(false);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isNotEmptyArray()('value')).toBe(false);
  });

  it('Test if value is an empty string', () => {
    expect(isNotEmptyArray()('')).toBe(false);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isNotEmptyArray()('   ')).toBe(false);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isNotEmptyArray()(1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isNotEmptyArray()(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isNotEmptyArray()(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isNotEmptyArray()(['a', 2, {}])).toBe(true);
  });

  it('Test if value is an empty array', () => {
    expect(isNotEmptyArray()([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isNotEmptyArray()({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isNotEmptyArray()({})).toBe(false);
  });
});
