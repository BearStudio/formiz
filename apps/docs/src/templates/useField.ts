export const useFieldFile = [
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
import { useField } from "@formiz/core";

export const Field = (props) => {
  const { name } = props;
  const {id, setValue, isSubmitted } = useField(props);

  return (
    <div>
    <>
      <div>{name}</div>
      <input className="demo-input" name={id.toString()} onChange={(e) => setValue(e.target.value)} />
      {isSubmitted && <p>Submitted !</p>}
    </>
    </div>
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
