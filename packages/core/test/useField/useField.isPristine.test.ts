import { renderUseField } from '../test-utils';

describe('useField: isPristine', () => {
  it('Should be pristine if setValue has never been called', async () => {
    const { result } = renderUseField({ name: 'field1' });
    expect(result.current.isPristine).toBe(true);
  });

  it('Should NOT be pristine if setValue has been called', async () => {
    const { result, act } = renderUseField({ name: 'field1' });
    await act(() => {
      result.current.setValue('new value');
    });
    expect(result.current.isPristine).toBe(false);
  });
});
