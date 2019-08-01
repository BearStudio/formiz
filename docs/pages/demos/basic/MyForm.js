import React from 'react';
import { Formiz, useForm } from '../../../../packages/core/src';
import { MyField } from './MyField';

export const MyForm = () => {
  const [myForm, myFormConnector] = useForm();
  const submitForm = (values) => {
    console.log(values); // { firstName: 'value', lastName: 'value' }
  };
  return (
    <Formiz onValidSubmit={submitForm} connect={myFormConnector}>
      <form onSubmit={myForm.submit}>
        <MyField
          name="firstName"
          label="First Name"
          isRequired="First Name is required"
          validations={[
            {
              rule: x => !!x,
              message: 'First Name is required',
            },
          ]}
        />
        <MyField
          name="lastName"
          label="Last Name"
          isRequired="Last Name is required"
          validations={[
            {
              rule: x => !!x,
              message: 'Last Name is required',
            },
          ]}
        />
        <button className="btn btn-primary" type="submit" disabled={!myForm.isValid}>
          Submit
        </button>
      </form>
    </Formiz>
  );
};
