import { renderUseField } from '../test-utils';

describe('useField: isValid', () => {
  it('Should be valid if there is no validations', async () => {
    const { result } = renderUseField({
      name: 'field1',
    });
    expect(result.current.isValid).toBe(true);
  });

  it('Should be invalid if one sync validation is false', async () => {
    const { result, waitFor } = renderUseField({
      name: 'field1',
      validations: [
        {
          rule: (v) => !!v,
        },
      ],
    });
    await waitFor(() => expect(result.current.isValid).toBe(false));
  });

  it('Should be invalid if one async validation is false', async () => {
    const { result, waitFor } = renderUseField({
      name: 'field1',
      asyncValidations: [
        {
          rule: async (v) => !!v,
        },
      ],
    });
    await waitFor(() => expect(result.current.isValid).toBe(false));
  });
});
