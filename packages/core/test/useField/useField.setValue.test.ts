import cases from 'jest-in-case';
import { renderUseField } from '../test-utils';

describe('useField: setValue', () => {
  cases('Should update the value', async ({ defaultValue = null, newValue }: any) => {
    const { act, result, formValues } = renderUseField({ name: 'field1', defaultValue });
    await act(() => {
      result.current.setValue(newValue);
    });
    expect(result.current.value).toStrictEqual(newValue);
    expect(formValues.current).toHaveProperty('field1', newValue);
  }, {
    'from string to null': { defaultValue: 'default value', newValue: null },
    undefined: { newValue: undefined },
    string: { newValue: 'new value' },
    'empty string': { newValue: '' },
    integer: { newValue: 22 },
    float: { newValue: 2.2 },
    zero: { newValue: 0 },
    array: { newValue: [1, 2, 3] },
    'empty array': { newValue: [] },
    object: { newValue: { a: 1, b: 2, c: 3 } },
    'empty object': { newValue: {} },
  });
});
