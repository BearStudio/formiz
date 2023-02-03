export const useFormFiles = [
  {
    name: "index.js",
    code: `
import { Formiz, useForm } from '@formiz/core';
import { Field } from './field.ts';

export default function Example() {
  const form = useForm();

  return (
    <Formiz autoForm connect={form}>
      <Field
        name="my-field"
        required="I'm required"
      />
      <pre>{JSON.stringify(form ?? {}, 0 , 2)}</pre>
      <button className="demo-button" type="submit">Valider</button>
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
  const { name } = props;
  const { value, setValue} = useField(props);
  return (
    <>
      <div>{name}</div>
      <input className="demo-input" value={value} onChange={(e) => setValue(e.target.value)} />
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
