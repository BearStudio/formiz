export const useFormFiles = [
  {
    name: "index.js",
    code: `
import { Formiz, useForm } from '@formiz/core';
import { Field } from './field.ts';

export default function Example() {
  const form = useForm();
  console.log({form})
  return (
    <Formiz autoForm connect={form}>
      <Field
        name="my-field"
        required="I'm required"
      />
      <pre>{JSON.stringify(form ?? {}, 0 , 2)}</pre>
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
