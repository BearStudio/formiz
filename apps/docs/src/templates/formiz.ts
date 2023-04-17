export const formizFiles = [
  {
    name: "index.js",
    code: `
import { useState } from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Field } from './field.ts';

export default function Example() {
  const [submittedValues, setSubmitted] = useState();
  const form = useForm({ onSubmit: setSubmitted })
  return (
    <Formiz connect={form} autoForm>
      <Field
        name="my-field"
        required="I'm required"
      />
      <pre>{JSON.stringify(submittedValues ?? {})}</pre>
      <button className="demo-button" type="submit">Valider</button>
    </Formiz>
  );
};
  `.trim(),
  },
  {
    name: "field.ts",
    code: `
import { useField, FieldProps } from '@formiz/core';

type MyFieldProps = FieldProps<string>

export const Field = (props: MyFieldProps) => {
  const { name } = props;
  const { value, setValue} = useField(props);
  return (
    <>
      <div>{name}</div>
      <input className="demo-input" value={value} onChange={e => setValue(e.target.value)} />
    </>
  );
};
  `.trim(),
  },
  {
    name: "style.css",
    code: `
.demo-button {
border: 1px solid #999;
padding: 5px 10px;
}

.demo-button:hover {
background-color: #303030;
}

.demo-input {
margin-bottom: 15px;
}
  `.trim(),
  },
];
