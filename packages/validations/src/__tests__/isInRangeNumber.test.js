import {
  isInRangeNumber,
} from '../index';

describe('isInRangeNumber', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isInRangeNumber(1, 5)(null)).toBe(false);
  });

  it('Test if value is undefined', () => {
    expect(isInRangeNumber(1, 5)(undefined)).toBe(false);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isInRangeNumber(1, 5)('value')).toBe(false);
  });

  it('Test if value is an empty string', () => {
    expect(isInRangeNumber(1, 5)('')).toBe(false);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isInRangeNumber(1, 5)('   ')).toBe(false);
  });

  // Numbers as strings

  it('Test if value is a number string in range', () => {
    expect(isInRangeNumber(1, 5)('1')).toBe(true);
  });

  it('Test if value is a number string over range', () => {
    expect(isInRangeNumber(1, 5)('6')).toBe(false);
  });

  it('Test if value is a negative number string under range', () => {
    expect(isInRangeNumber(1, 5)('-1')).toBe(false);
  });

  it('Test if value is a float number string under range', () => {
    expect(isInRangeNumber(1, 5)('0.99')).toBe(false);
  });

  it('Test if value is a float number string in range', () => {
    expect(isInRangeNumber(1, 5)('1.99')).toBe(true);
  });

  it('Test if value is a wrong float number string', () => {
    expect(isInRangeNumber(1, 5)('0.99.99')).toBe(false);
  });

  // Numbers

  it('Test if value is a number in range', () => {
    expect(isInRangeNumber(1, 5)(1)).toBe(true);
  });

  it('Test if value is a number over range', () => {
    expect(isInRangeNumber(1, 5)(6)).toBe(false);
  });

  it('Test if value is a negative number under range', () => {
    expect(isInRangeNumber(1, 5)(-1)).toBe(false);
  });

  it('Test if value is a float in range', () => {
    expect(isInRangeNumber(1, 5)(1.99)).toBe(true);
  });

  it('Test if value is a float under range', () => {
    expect(isInRangeNumber(1, 5)(0.99)).toBe(false);
  });

  it('Test if value is zero under range', () => {
    expect(isInRangeNumber(1, 5)(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isInRangeNumber(1, 5)(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isInRangeNumber(1, 5)(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isInRangeNumber(1, 5)([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isInRangeNumber(1, 5)({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isInRangeNumber(1, 5)({})).toBe(false);
  });
});
