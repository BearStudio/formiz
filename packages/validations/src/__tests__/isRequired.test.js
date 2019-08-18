import {
  isRequired,
} from '../index';

describe('isRequired', () => {
  // Empty

  it('Should return false if value is null', () => {
    expect(isRequired()(null)).toBe(false);
  });

  it('Should return false if value is undefined', () => {
    expect(isRequired()(undefined)).toBe(false);
  });

  // Strings

  it('Should return true if value is a string', () => {
    expect(isRequired()('value')).toBe(true);
  });

  it('Should return false if value is an empty string', () => {
    expect(isRequired()('')).toBe(false);
  });

  it('Should return true if value is a string with only spaces', () => {
    expect(isRequired()('   ')).toBe(true);
  });

  // Numbers

  it('Should return true if value is a number', () => {
    expect(isRequired()(1)).toBe(true);
  });

  it('Should return true if value is zero', () => {
    expect(isRequired()(0)).toBe(true);
  });

  it('Should return false if value is NaN', () => {
    expect(isRequired()(NaN)).toBe(false);
  });

  // Arrays

  it('Should return true if value is a array', () => {
    expect(isRequired()(['a', 2, {}])).toBe(true);
  });

  it('Should return true if value is an empty array', () => {
    expect(isRequired()([])).toBe(true);
  });

  // Objects

  it('Should return true if value is a object', () => {
    expect(isRequired()({ a: 1, b: 2 })).toBe(true);
  });

  it('Should return true if value is an empty object', () => {
    expect(isRequired()({})).toBe(true);
  });
});
