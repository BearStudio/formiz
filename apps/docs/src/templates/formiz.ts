export const formizFiles = [
  {
    name: "index.js",
    code: `
import { useState } from 'react';
import { Formiz } from '@formiz/core';
import { Field } from './field.ts';

export default function Example() {
  const [submittedValues, setSubmitted] = useState();
  return (
    <Formiz autoForm onSubmit={values => setSubmitted(values)}>
      <Field
        name="my-field"
        required="I'm required"
      />
      <pre>{JSON.stringify(submittedValues ?? {})}</pre>
      <button type="submit">Valider</button>
    </Formiz>
  );
};
  `.trim(),
  },
  {
    name: "field.ts",
    code: `
import { useField } from '@formiz/core';

export const Field = (props) => {
  const { value, setValue} = useField(props);
  return (
    <input value={value} onChange={e => setValue(e.target.value)} />
  );
};
  `.trim(),
  },
];
