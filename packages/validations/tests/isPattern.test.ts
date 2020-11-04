import cases from 'jest-in-case';
import {
  isPattern,
} from '../src/index';

describe('isPattern', () => {
  cases('Test pattern "^[a-z]*$"', ({ value, result = true }: any) => expect(isPattern('^[a-z]*$')(value)).toBe(result), {
    null: { value: null, result: true },
    undefined: { value: undefined, result: true },
    emptyString: { value: '', result: true },
    emptyStringWithSpaces: { value: '   ', result: false },
    validString: { value: 'value', result: true },
    invalidString: { value: 'vàlue', result: false },
    NaN: { value: NaN, result: false },
    zero: { value: 0, result: false },
    float: { value: 1.2, result: false },
    number: { value: 12, result: false },
    emptyArray: { value: [], result: false },
    array: { value: ['a', 2, {}], result: false },
    emptyObject: { value: {}, result: false },
    object: { value: { a: 1, b: 2 }, result: false },
  });

  cases('Test pattern "hello"', ({ value, result = true }: any) => expect(isPattern('hello')(value)).toBe(result), {
    null: { value: null, result: true },
    undefined: { value: undefined, result: true },
    emptyString: { value: '', result: true },
    emptyStringWithSpaces: { value: '   ', result: false },
    validString: { value: 'Welcome, hello world', result: true },
    invalidString: { value: 'Good bye', result: false },
    NaN: { value: NaN, result: false },
    zero: { value: 0, result: false },
    float: { value: 1.2, result: false },
    number: { value: 12, result: false },
    emptyArray: { value: [], result: false },
    array: { value: ['a', 2, {}], result: false },
    emptyObject: { value: {}, result: false },
    object: { value: { a: 1, b: 2 }, result: false },
  });
});
