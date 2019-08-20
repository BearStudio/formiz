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
        email: 'Error from API',
      })
    }, 1000)
  }
  return (
    <Formiz onValidSubmit={submitForm} connect={myForm}>
      <form
        noValidate
        onSubmit={myForm.submitStep}
        className="demo-form"
        style={{ minHeight: '16rem' }}
      >
        <div className="demo-form__content">
          <FormizStep name="step1">
            ${FieldsStep1}
          </FormizStep>
          <FormizStep name="step2">
            ${FieldsStep2}
          </FormizStep>
        </div>

        <div className="demo-form__footer">
          <div className="mr-auto" style={{ minWidth: '6rem' }}>
            {!myForm.isFirstStep && (
              <button
                className="demo-button"
                type="button"
                onClick={myForm.prevStep}
              >
                Previous
              </button>
            )}
          </div>
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
            {myForm.isLastStep ? (
              <button
                className="demo-button is-primary"
                type="submit"
                disabled={isLoading || (!myForm.isValid && myForm.isSubmitted)}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            ) : (
              <button
                className="demo-button is-primary"
                type="submit"
                disabled={!myForm.isStepValid && myForm.isStepSubmitted}
              >
                Next
              </button>
            )}
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
