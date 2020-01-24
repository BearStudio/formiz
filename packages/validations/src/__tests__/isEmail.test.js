import {
  isEmail,
} from '../index';

describe('isEmail', () => {
  // Empty

  it('Test if value is null', () => {
    expect(isEmail()(null)).toBe(true);
  });

  it('Test if value is undefined', () => {
    expect(isEmail()(undefined)).toBe(true);
  });

  it('Test if value is an empty string', () => {
    expect(isEmail()('')).toBe(true);
  });

  // Strings

  it('Test if value is a string', () => {
    expect(isEmail()('value')).toBe(false);
  });

  it('Test if value is a string', () => {
    expect(isEmail()('value.fr')).toBe(false);
  });

  it('Test if value is a string', () => {
    expect(isEmail()('email@domain')).toBe(false);
  });

  it('Test if value is a string', () => {
    expect(isEmail()('email@domain.fr')).toBe(true);
  });

  it('Test if value is a string with only spaces', () => {
    expect(isEmail()('   ')).toBe(false);
  });

  // Numbers

  it('Test if value is a number', () => {
    expect(isEmail()(1)).toBe(false);
  });

  it('Test if value is zero', () => {
    expect(isEmail()(0)).toBe(false);
  });

  it('Test if value is NaN', () => {
    expect(isEmail()(NaN)).toBe(false);
  });

  // Arrays

  it('Test if value is an array', () => {
    expect(isEmail()(['a', 2, {}])).toBe(false);
  });

  it('Test if value is an empty array', () => {
    expect(isEmail()([])).toBe(false);
  });

  // Objects

  it('Test if value is a object', () => {
    expect(isEmail()({ a: 1, b: 2 })).toBe(false);
  });

  it('Test if value is an empty object', () => {
    expect(isEmail()({})).toBe(false);
  });
});
