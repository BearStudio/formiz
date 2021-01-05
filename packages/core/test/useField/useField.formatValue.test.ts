import cases from 'jest-in-case';
import { renderUseField, getUseFieldUtils } from '../test-utils';

describe('useField: formatValue', () => {
  it('Should format the default value', async () => {
    const { result, formValues } = renderUseField({
      name: 'field1',
      formatValue: (v: any) => `__${v}__`,
      defaultValue: 'default value',
    });
    expect(result.current.value).toBe('default value');
    expect(formValues.current).toHaveProperty('field1', '__default value__');
  });

  it('Should format the value by default without default value (null)', async () => {
    const { result, formValues } = renderUseField({
      name: 'field1',
      formatValue: (v: any) => `__${v}__`,
    });
    expect(result.current.value).toBe(null);
    expect(formValues.current).toHaveProperty('field1', '__null__');
  });

  cases('Should format new value', async ({
    formatValue = (v: any) => `__${v}__`,
    newValue,
  }: any) => {
    const { onChangeValue, onChange } = getUseFieldUtils();
    const { act, result, formValues } = renderUseField({
      name: 'field1',
      onChange,
      formatValue,
    });
    await act(() => {
      result.current.setValue(newValue);
    });
    expect(result.current.value).toStrictEqual(newValue);
    expect(onChangeValue.current).toStrictEqual(formatValue(newValue));
    expect(formValues.current).toHaveProperty('field1', formatValue(newValue));
  }, {
    null: { newValue: null },
    undefined: { newValue: undefined },
    string: { newValue: 'new value' },
    'empty string': { newValue: '' },
    integer: { newValue: 22 },
    float: { newValue: 2.2 },
    zero: { newValue: 0 },
    array: { newValue: [1, 2, 3] },
    'empty array': { newValue: [] },
    'array with map': {
      newValue: [1, 2, 3],
      formatValue: (v: any) => v?.map((x: any) => x + 1),
    },
    object: { newValue: { a: 1, b: 2, c: 3 } },
    'empty object': { newValue: {} },
  });
});
