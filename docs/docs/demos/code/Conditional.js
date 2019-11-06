import { MyField } from './MyField';
import { FieldsStep1 } from './FieldsStep1Conditional';
import { FieldsStep2 } from './FieldsStep2';
import { FieldsStep3 } from './FieldsStep3';

export const MyForm = `
// 2. Create a form with multi steps & fields
const MyForm = () => {
  const myForm = useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFieldNameVisible, setIsFieldNameVisible] = React.useState(true)
  const [isStep2Visible, setIsStep2Visible] = React.useState(true)

  const submitForm = (values) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      alert(JSON.stringify(values))
      myForm.invalidateFields({
        email: 'You can display an error after an API call',
      })
    }, 1000)
  }
  return (
    <Formiz onValidSubmit={submitForm} connect={myForm}>
      <form
        noValidate
        onSubmit={myForm.submit}
        className="demo-form"
        style={{ minHeight: '16rem' }}
      >
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsFieldNameVisible(x => !x)}
            className="demo-button is-secondary is-small mx-1"
          >
            {isFieldNameVisible ? 'Hide' : 'Show' } Field "Name"
          </button>
          <button
            type="button"
            onClick={() => setIsStep2Visible(x => !x)}
            className="demo-button is-secondary is-small mx-1"
          >
            {isStep2Visible ? 'Hide' : 'Show' } Step B
          </button>
        </div>
        <div className="demo-form__tabs">
          {myForm.steps.map(step => (
            <button
              key={step.name}
              className={\`demo-form__tab \${step.name === myForm.currentStep.name ? 'is-active' : ''}\`}
              type="button"
              onClick={() => myForm.goToStep(step.name)}
            >
              {!step.isValid && step.isSubmitted && (
                <small className="mr-2">⚠️</small>
              )}
              { step.label }
            </button>
          ))}
        </div>
        <div className="demo-form__content">
          <FormizStep name="step1" label="Step A">
            ${FieldsStep1(false)}
          </FormizStep>
          <FormizStep name="step2" label="Step B" isEnabled={isStep2Visible}>
            ${FieldsStep2(true)}
          </FormizStep>
          <FormizStep name="step3" label="Step C">
            ${FieldsStep3(true)}
          </FormizStep>
        </div>

        <div className="demo-form__footer">
          <div className="text-sm text-gray-500 p-2 text-center w-full xs:w-auto order-first xs:order-none">
            Step
            {' '}
            {myForm.currentStep && myForm.currentStep.index + 1}
            {' '}
            of
            {' '}
            {myForm.steps.length}
          </div>
          <div
            className="ml-auto"
            style={{ minWidth: '6rem' }}
          >
            <button
              className="demo-button is-full is-primary"
              type="submit"
              disabled={isLoading || (!myForm.isValid && myForm.isSubmitted)}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </Formiz>
  )
}
`;

export const Render = `
${MyField}
${MyForm}
render(
  <MyForm />
)
`;
