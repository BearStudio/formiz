import {
  isLength,
} from '../index';

describe('isLength', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isLength(2)(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isLength(2)(undefined)).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isLength(2)('value')).toBe(false);
  });

  it('Test if value is a string with 2 characters', () => {
    expect(isLength(2)('ab')).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isLength(2)('')).toBe(false);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isLength(2)('   ')).toBe(false);
  });

  it('Test if value is a string with only 2 spaces', () => {
    expect(isLength(2)('  ')).toBe(true);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isLength(2)(1)).toBe(false);
  });

  it('Test if value is a number equal length', () => {
    expect(isLength(2)(2)).toBe(false);
  });

  it('Test if value is a negative number', () => {
    expect(isLength(2)(-1)).toBe(false);
  });

  it('Test if value is a float', () => {
    expect(isLength(2)(0.99)).toBe(false);
  });

  it('Test if value is a float over', () => {
    expect(isLength(2)(1.1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isLength(2)(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isLength(2)(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isLength(2)(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an array with 2 entries', () => {
    expect(isLength(2)(['a', 2])).toBe(true);
  });

  it('Test if value is an empty array', () => {
    expect(isLength(2)([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isLength(2)({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isLength(2)({})).toBe(false);
  });
});
