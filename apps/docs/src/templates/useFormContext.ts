export const useFormContextFile = [
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
        <button className="demo-button" type="submit">Valider</button>
      </Formiz>
    );
  };
    `.trim(),
  },
  {
    name: "field.ts",
    code: `
import { useField, useFormContext } from '@formiz/core';

export const Field = (props) => {
  const { name } = props;
  const { value, setValue } = useField(props);
  const form = useFormContext();
  return (
    <>
      <div>{name}</div>
      <input className="demo-input" value={value} onChange={(e) => setValue(e.target.value)} />
      <pre>{JSON.stringify(form ?? {}, 0, 2)}</pre>
      <p className="demo-message">Formiz 🐜 {form.isValid ? 'valid' : 'not valid'}</p>
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

.demo-message {
padding: 10px 0;
}
  `.trim(),
  },
];
