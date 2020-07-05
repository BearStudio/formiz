import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Formiz } from '../src';
import { Field } from './test-utils';

describe('<Formiz />', () => {
  it('Should mount without crashing', () => {
    render((
      <Formiz>
        My Form
      </Formiz>
    ));
  });

  it('Should mount fields without crashing', () => {
    render((
      <Formiz>
        <Field name="field1" />
        <Field name="field2" />
      </Formiz>
    ));
  });

  it('Should mount 2 separated `<Formiz>` without crashing', () => {
    render((
      <div>
        <Formiz>
          <Field name="field1" />
          <Field name="field2" />
        </Formiz>
        <Formiz>
          <Field name="field1" />
          <Field name="field2" />
        </Formiz>
      </div>
    ));
  });

  it('Should be valid if all fields are valid', async () => {
    let isFormValid: any = null;
    const mockValid = jest.fn(() => { isFormValid = true; });
    const mockInvalid = jest.fn(() => { isFormValid = false; });

    render((
      <Formiz onValid={mockValid} onInvalid={mockInvalid}>
        <Field name="field1" />
        <Field name="field2" />
      </Formiz>
    ));

    await waitFor(() => expect(isFormValid).toBe(true));
  });

  it('Should be invalid if one field is invalid', async () => {
    let isFormValid: any = null;
    const mockValid = jest.fn(() => { isFormValid = true; });
    const mockInvalid = jest.fn(() => { isFormValid = false; });

    render((
      <Formiz onValid={mockValid} onInvalid={mockInvalid}>
        <Field
          name="field1"
          validations={[
            { rule: (x: any) => !!x },
          ]}
        />
        <Field name="field2" />
      </Formiz>
    ));

    await waitFor(() => expect(isFormValid).toBe(false));
  });

  it('Should be valid if one field pass from invalid to valid', async () => {
    let isFormValid: any = null;
    const mockValid = jest.fn(() => { isFormValid = true; });
    const mockInvalid = jest.fn(() => { isFormValid = false; });

    const { getByLabelText } = render((
      <Formiz onValid={mockValid} onInvalid={mockInvalid}>
        <Field
          name="field1"
          validations={[
            { rule: (x: any) => !!x },
          ]}
        />
      </Formiz>
    ));

    await waitFor(() => expect(isFormValid).toBe(false));
    await user.type(getByLabelText('field1'), 'new value');
    await waitFor(() => expect(isFormValid).toBe(true));
  });

  it('Should get default values on submit', async () => {
    let formValues: any = null;
    const mockSubmit = jest.fn((values) => { formValues = values; });

    const { getByText } = render((
      <Formiz onSubmit={mockSubmit} autoForm>
        <Field
          name="field1"
          defaultValue="value 1"
        />
        <button type="submit">
          Submit
        </button>
      </Formiz>
    ));


    await user.click(getByText('Submit'));
    await waitFor(() => expect(formValues).toHaveProperty('field1', 'value 1'));
  });

  it('Should get null values on submit', async () => {
    let formValues: any = null;
    const mockSubmit = jest.fn((values) => { formValues = values; });

    const { getByText } = render((
      <Formiz onSubmit={mockSubmit} autoForm>
        <Field
          name="field1"
        />
        <button type="submit">
          Submit
        </button>
      </Formiz>
    ));


    await user.click(getByText('Submit'));
    await waitFor(() => expect(formValues).toHaveProperty('field1', null));
  });


  it('Should get form values on submit after field updated', async () => {
    let formValues: any = null;
    const mockSubmit = jest.fn((values) => { formValues = values; });

    const { getByText, getByLabelText } = render((
      <Formiz onSubmit={mockSubmit} autoForm>
        <Field
          name="field1"
        />
        <button type="submit">
          Submit
        </button>
      </Formiz>
    ));

    await user.type(getByLabelText('field1'), 'new value');
    await waitFor(() => expect(getByLabelText('field1')).toHaveProperty('value', 'new value'));

    await user.click(getByText('Submit'));
    await waitFor(() => expect(formValues).toHaveProperty('field1', 'new value'));
  });
});
