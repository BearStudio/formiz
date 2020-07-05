import * as React from 'react';
import { Field, renderUseForm } from './test-utils';

describe('useForm: Mount', () => {
  it('Should be valid by default', async () => {
    const { result } = renderUseForm({});
    expect(result.current.isValid).toBe(true);
  });

  it('Should be invalid if a least one field is invalid', async () => {
    const { result, waitForNextUpdate } = renderUseForm({}, <Field name="field1" validations={[{ rule: (x: any) => !!x }]} />);
    await waitForNextUpdate(() => expect(result.current.isValid).toBe(false));
  });

  it('Should get the field key in values', async () => {
    const { result, waitForNextUpdate } = renderUseForm({}, <Field name="field1" />);
    await waitForNextUpdate(() => expect(result.current.values).toHaveProperty('field1', null));
  });

  it('Should get the field key and the field default value in values', async () => {
    const { result, waitForNextUpdate } = renderUseForm({}, <Field name="field1" defaultValue="default value" />);
    await waitForNextUpdate(() => expect(result.current.values).toHaveProperty('field1', 'default value'));
  });
});
