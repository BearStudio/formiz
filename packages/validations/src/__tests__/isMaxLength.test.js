import {
  isMaxLength,
} from '../index';

describe('isMaxLength', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isMaxLength(2)(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isMaxLength(2)(undefined)).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isMaxLength(2)('value')).toBe(false);
  });

  it('Test if value is a string with 1 character', () => {
    expect(isMaxLength(2)('a')).toBe(true);
  });

  it('Test if value is a string with 2 characters', () => {
    expect(isMaxLength(2)('ab')).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isMaxLength(2)('')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isMaxLength(2)('   ')).toBe(false);
  });

  it('Test if value is a string with only 2 spaces', () => {
    expect(isMaxLength(2)('  ')).toBe(true);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isMaxLength(2)(1)).toBe(false);
  });

  it('Test if value is a number equal length', () => {
    expect(isMaxLength(2)(2)).toBe(false);
  });

  it('Test if value is a negative number', () => {
    expect(isMaxLength(2)(-1)).toBe(false);
  });

  it('Test if value is a float', () => {
    expect(isMaxLength(2)(0.99)).toBe(false);
  });

  it('Test if value is a float over', () => {
    expect(isMaxLength(2)(1.1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isMaxLength(2)(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isMaxLength(2)(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isMaxLength(2)(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an array with 2 entries', () => {
    expect(isMaxLength(2)(['a', 2])).toBe(true);
  });

  it('Test if value is an array with 1 entrie', () => {
    expect(isMaxLength(2)(['a'])).toBe(true);
  });

  it('Test if value is an empty array', () => {
    expect(isMaxLength(2)([])).toBe(true);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isMaxLength(2)({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isMaxLength(2)({})).toBe(false);
  });
});
