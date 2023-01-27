export const useFormContextFile = [
  {
    name: 'index.js',
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
        <button type="submit">Valider</button>
      </Formiz>
    );
  };
    `.trim(),
  },
  {
    name: 'field.ts',
    code: `
import { useField, useFormContext } from '@formiz/core';

export const Field = (props) => {
  const { value, setValue } = useField(props);
  const form = useFormContext();
  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <pre>{JSON.stringify(form ?? {}, 0, 2)}</pre>
      <p>Formiz 🐜 {form.isValid ? 'valid' : 'not valid'}</p>
    </>
  );
};
    `.trim(),
  },
];
