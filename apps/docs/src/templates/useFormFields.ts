export const useFormFields = [
  {
    name: "index.js",
    code: `
import { Formiz, useForm, useFormFields } from '@formiz/core';
import { Field } from './field.ts';

export default function Example() {
  const form = useForm();

  const selectedFields = useFormFields({
    connect: form,
    fields: ["firstName"],
    selector: (field) => ({isPristine: field.isPristine, isValid: field.isValid})
  });

  return (
    <Formiz autoForm connect={form}>
      <Field
        name="firstName"
        required="I'm required"
        placeholder
      />
      <br />
      <Field
      name="lastName"
      required="I'm required"
    />
      <pre>{JSON.stringify(selectedFields ?? {}, 0 , 2)}</pre>
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
