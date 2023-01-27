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
    name: "stepper.ts",
    code: `
import { useFormContext } from '@formiz/core';

export const Stepper = () => {
  const form = useFormContext();
  return (
    <>
      <button className="demo-button" onClick={() => form.goToPreviousStep()}>Previous Step</button>
      <span className="demo-current-step">{form?.currentStep?.name}</span>
      <button className="demo-button" onClick={() => form.goToNextStep()}>Next Step</button>
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

.demo-current-step {
  padding: 10px;
}
    `.trim(),
  },
];
