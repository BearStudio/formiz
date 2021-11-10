import * as React from 'react';
import { Field, renderUseForm } from './test-utils';

describe('useForm: Mount', () => {
  it('Should be valid by default', async () => {
    const { result } = renderUseForm({});
    expect(result.current.isValid).toBe(true);
  });

  it('Should be invalid if a least one field is invalid', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      {},
      <Field name="fieldA" validations={[{ rule: (x: any) => !!x }]} />,
    );
    await waitForNextUpdate();
    expect(result.current.isValid).toBe(false);
  });

  it('Should get the field key in values', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      {},
      <Field name="fieldA" />,
    );
    await waitForNextUpdate();
    expect(result.current.values).toHaveProperty('fieldA', null);
  });

  it('Should get the field key and the field default value in values', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      {},
      <Field name="fieldA" defaultValue="default value" />,
    );
    await waitForNextUpdate();
    expect(result.current.values).toHaveProperty('fieldA', 'default value');
  });

  it('Should get not subscribed if subscribe is false', async () => {
    const { result } = renderUseForm({ subscribe: false }, <Field name="fieldA" validations={[{ rule: (x: any) => !!x }]} />);
    expect(result.current.isValid).toBe(undefined);
  });

  it('Should get subscribed to form and not values if subscribe is "form"', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: 'form' },
      <Field name="fieldA" validations={[{ rule: (x: any) => !!x }]} />,
    );
    await waitForNextUpdate();
    expect(result.current.isValid).toBe(false);
    expect(result.current.values).toBe(undefined);
  });

  it('Should get subscribed to values and not form if subscribe is "fields"', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: 'fields' },
      <Field name="fieldA" validations={[{ rule: (x: any) => !!x }]} />,
    );
    await waitForNextUpdate();
    expect(result.current.isValid).toBe(undefined);
    expect(result.current.values).toHaveProperty('fieldA');
  });

  it('Should get subscribed to some fields (1)', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: { fields: ['fieldA'] } },
      <>
        <Field name="fieldA" />
        <Field name="fieldB" />
        <Field name="field.A" />
        <Field name="field.B" />
        <Field name="fields[0].A" />
        <Field name="fields[1].B" />
      </>,
    );
    await waitForNextUpdate();
    expect(result.current.values).toHaveProperty('fieldA');
    expect(result.current.values).not.toHaveProperty('fieldB');
    expect(result.current.values).not.toHaveProperty('field');
    expect(result.current.values).not.toHaveProperty('fields');
  });

  it('Should get subscribed to some fields (2)', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: { fields: ['fieldA', 'fieldB'] } },
      <>
        <Field name="fieldA" />
        <Field name="fieldB" />
        <Field name="field.A" />
        <Field name="field.B" />
        <Field name="fields[0].A" />
        <Field name="fields[1].B" />
      </>,
    );
    await waitForNextUpdate();
    expect(result.current.values).toHaveProperty('fieldA');
    expect(result.current.values).toHaveProperty('fieldB');
    expect(result.current.values).not.toHaveProperty('field');
    expect(result.current.values).not.toHaveProperty('fields');
  });

  it('Should get subscribed to some fields (3)', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: { fields: ['field'] } },
      <>
        <Field name="fieldA" />
        <Field name="fieldB" />
        <Field name="field.A" />
        <Field name="field.B" />
        <Field name="fields[0].A" />
        <Field name="fields[1].B" />
      </>,
    );
    await waitForNextUpdate();
    expect(result.current.isValid).toBe(undefined);
    expect(result.current.values).not.toHaveProperty('fieldA');
    expect(result.current.values).not.toHaveProperty('fieldB');
    expect(result.current.values.field).toHaveProperty('A');
    expect(result.current.values.field).toHaveProperty('B');
    expect(result.current.values).not.toHaveProperty('fields');
  });

  it('Should get subscribed to some fields (4)', async () => {
    const { result, waitForNextUpdate } = renderUseForm(
      { subscribe: { fields: ['fields'] } },
      <>
        <Field name="fieldA" />
        <Field name="fieldB" />
        <Field name="field.A" />
        <Field name="field.B" />
        <Field name="fields[0].A" />
        <Field name="fields[1].B" />
      </>,
    );
    await waitForNextUpdate();
    expect(result.current.isValid).toBe(undefined);
    expect(result.current.values).not.toHaveProperty('fieldA');
    expect(result.current.values).not.toHaveProperty('fieldB');
    expect(result.current.values).not.toHaveProperty('field');
    expect(result.current.values?.fields?.[0]).toHaveProperty('A');
    expect(result.current.values?.fields?.[1]).toHaveProperty('B');
  });
});
