import { MyField } from './MyField';
import { FieldsStep1 } from './FieldsStep1';
import { FieldsStep2 } from './FieldsStep2';

export const MyForm = `
// 2. Create a form with multi steps & fields
const MyForm = () => {
  const myForm = useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  const submitForm = (values) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      alert(JSON.stringify(values))
      myForm.invalidateFields({
        email: 'You can display an error after an API call',
      })
      myForm.goToStep('step2')
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
            ${FieldsStep1(true)}
          </FormizStep>
          <FormizStep name="step2" label="Step B">
            ${FieldsStep2(true)}
          </FormizStep>
        </div>

        <div className="demo-form__footer">
          <div
            className="ml-auto"
            style={{ minWidth: '6rem' }}
          >
            <button
              className="demo-button is-primary"
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
