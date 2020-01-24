import {
  isPercentage,
} from '../index';

describe('isPercentage', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isPercentage()(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isPercentage()(undefined)).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isPercentage()('')).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isPercentage()('value')).toBe(false);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isPercentage()('   ')).toBe(false);
  });

  // Numbers as strings

  it('Test if value is a number string in range', () => {
    expect(isPercentage()('1')).toBe(true);
  });

  it('Test if value is a number string over range', () => {
    expect(isPercentage()('101')).toBe(false);
  });

  it('Test if value is a negative number string under range', () => {
    expect(isPercentage()('-1')).toBe(false);
  });

  it('Test if value is a float number string under range', () => {
    expect(isPercentage()('-0.99')).toBe(false);
  });

  it('Test if value is a float number string over range', () => {
    expect(isPercentage()('100.99')).toBe(false);
  });

  it('Test if value is a float number string in range', () => {
    expect(isPercentage()('1.99')).toBe(true);
  });

  it('Test if value is a wrong float number string', () => {
    expect(isPercentage()('0.99.99')).toBe(false);
  });

  // Numbers

  it('Test if value is a number in range', () => {
    expect(isPercentage()(1)).toBe(true);
  });

  it('Test if value is a number over range', () => {
    expect(isPercentage()(101)).toBe(false);
  });

  it('Test if value is a negative number under range', () => {
    expect(isPercentage()(-1)).toBe(false);
  });

  it('Test if value is a float in range', () => {
    expect(isPercentage()(1.99)).toBe(true);
  });

  it('Test if value is a float under range', () => {
    expect(isPercentage()(-0.99)).toBe(false);
  });

  it('Test if value is a float over range', () => {
    expect(isPercentage()(100.99)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isPercentage()(0)).toBe(true);
  });

  it('Test if value is NaN', () => {
    expect(isPercentage()(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isPercentage()(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isPercentage()([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isPercentage()({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isPercentage()({})).toBe(false);
  });
});
