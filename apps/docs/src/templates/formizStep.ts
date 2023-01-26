export const formizStep = [
    {
      name: "index.js",
      code: `
  import { Formiz, FormizStep, useForm } from '@formiz/core';
  import { Field } from './field.ts';
  import { Stepper } from './stepper.ts';

  export default function Example() {
    const form = useForm();

    return (
      <Formiz autoForm connect={form}>
      <FormizStep name="step1">
        <Field
          name="my-first-field"
          required="I'm required"
        />  
      </FormizStep>
      <FormizStep name="step2">
        <Field
          name="my-second-field"
        />
      </FormizStep>
        <pre>{JSON.stringify(form?.currentStep ?? {}, 0 , 2)}</pre>
        <Stepper />
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
    {
      name: "stepper.ts",
      code: `
  import { useFormContext } from '@formiz/core';
  
  export const Stepper = () => {
    const form = useFormContext();
    return (
      <>
        <button onClick={() => form.goToPreviousStep()}>Previous Step</button>
        <button onClick={() => form.goToNextStep()}>Next Step</button>
      </>
    );
  };
      `.trim(),
      },
  ];
  