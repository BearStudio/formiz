import {
  isNumber,
} from '../index';

describe('isNumber', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isNumber()(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isNumber()(undefined)).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isNumber()('value')).toBe(false);
  });

  it('Test if value is an empty string', () => {
    expect(isNumber()('')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isNumber()('   ')).toBe(false);
  });

  // Numbers as strings

  it('Test if value is a number string', () => {
    expect(isNumber()('1')).toBe(true);
  });

  it('Test if value is a negative number string', () => {
    expect(isNumber()('-1')).toBe(true);
  });

  it('Test if value is a float number string', () => {
    expect(isNumber()('0.99')).toBe(true);
  });

  it('Test if value is a wrong float number string', () => {
    expect(isNumber()('0.99.99')).toBe(false);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isNumber()(1)).toBe(true);
  });

  it('Test if value is a negative number', () => {
    expect(isNumber()(-1)).toBe(true);
  });

  it('Test if value is a float', () => {
    expect(isNumber()(0.99)).toBe(true);
  });

  it('Test if value is zero', () => {
    expect(isNumber()(0)).toBe(true);
  });

  it('Test if value is NaN', () => {
    expect(isNumber()(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isNumber()(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isNumber()([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isNumber()({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isNumber()({})).toBe(false);
  });
});
