import {
  isMinLength,
} from '../index';

describe('isMinLength', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isMinLength(2)(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isMinLength(2)(undefined)).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isMinLength(2)('value')).toBe(true);
  });

  it('Test if value is a string with 1 character', () => {
    expect(isMinLength(2)('a')).toBe(false);
  });

  it('Test if value is a string with 2 characters', () => {
    expect(isMinLength(2)('ab')).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isMinLength(2)('')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isMinLength(2)('   ')).toBe(true);
  });

  it('Test if value is a string with only 2 spaces', () => {
    expect(isMinLength(2)('  ')).toBe(true);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isMinLength(2)(1)).toBe(false);
  });

  it('Test if value is a number equal length', () => {
    expect(isMinLength(2)(2)).toBe(false);
  });

  it('Test if value is a negative number', () => {
    expect(isMinLength(2)(-1)).toBe(false);
  });

  it('Test if value is a float', () => {
    expect(isMinLength(2)(0.99)).toBe(false);
  });

  it('Test if value is a float over', () => {
    expect(isMinLength(2)(1.1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isMinLength(2)(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isMinLength(2)(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isMinLength(2)(['a', 2, {}])).toBe(true);
  });

  it('Test if value is an array with 2 entries', () => {
    expect(isMinLength(2)(['a', 2])).toBe(true);
  });

  it('Test if value is an array with 1 entrie', () => {
    expect(isMinLength(2)(['a'])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isMinLength(2)([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isMinLength(2)({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isMinLength(2)({})).toBe(false);
  });
});
