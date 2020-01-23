import {
  isMaxNumber,
} from '../index';

describe('isMaxNumber', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isMaxNumber(1)(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isMaxNumber(1)(undefined)).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isMaxNumber(1)('value')).toBe(false);
  });

  it('Test if value is an empty string', () => {
    expect(isMaxNumber(1)('')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isMaxNumber(1)('   ')).toBe(false);
  });

  // Numbers as strings

  it('Test if value is a number string equal max', () => {
    expect(isMaxNumber(1)('1')).toBe(true);
  });

  it('Test if value is a number string over max', () => {
    expect(isMaxNumber(1)('2')).toBe(false);
  });

  it('Test if value is a negative number string under max', () => {
    expect(isMaxNumber(1)('-1')).toBe(true);
  });

  it('Test if value is a float number string under max', () => {
    expect(isMaxNumber(1)('0.99')).toBe(true);
  });

  it('Test if value is a wrong float number string', () => {
    expect(isMaxNumber(1)('0.99.99')).toBe(false);
  });

  // Numbers

  it('Test if value is a number equal max', () => {
    expect(isMaxNumber(1)(1)).toBe(true);
  });

  it('Test if value is a number over max', () => {
    expect(isMaxNumber(1)(2)).toBe(false);
  });

  it('Test if value is a negative number under max', () => {
    expect(isMaxNumber(1)(-1)).toBe(true);
  });

  it('Test if value is a float under max', () => {
    expect(isMaxNumber(1)(0.99)).toBe(true);
  });

  it('Test if value is zero under max', () => {
    expect(isMaxNumber(1)(0)).toBe(true);
  });

  it('Test if value is NaN', () => {
    expect(isMaxNumber(1)(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isMaxNumber(1)(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isMaxNumber(1)([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isMaxNumber(1)({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isMaxNumber(1)({})).toBe(false);
  });
});
