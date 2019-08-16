export const MyField = `
// 1. Create a reusable field
const MyField = (props) => {
  const {
    value, setValue, errorMessage, isValid, isPristine, isSubmitted
  } = useField(props)
  const { label } = props
  const showError = !isValid && (!isPristine || isSubmitted)
  return (
    <div className="mb-4">
      <label className="block font-bold text-sm text-gray-600 mb-1">
        { label }
      </label>
      <Input
        type="text"
        defaultValue={value}
        isValid={!showError}
        onChange={e => setValue(e.target.value)}
      />
      {showError && (
        <div className="block text-sm text-red-600 mt-1">
          { errorMessage }
        </div>
      )}
    </div>
  )
}
`;

export const MyForm = `
// 2. Create a form with multi steps & fields
const MyForm = () => {
  const [myForm, myFormConnector] = useForm()
  const [isLoading, setIsLoading] = React.useState(false)
  const submitForm = (values) => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      alert(JSON.stringify(values)) // { firstName: 'value', lastName: 'value' }
    }, 1000)
  }
  return (
    <Formiz onValidSubmit={submitForm} connect={myFormConnector}>
      <form
        onSubmit={myForm.submit}
        className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        style={{ minHeight: '16rem' }}
      >
        <div className="p-4 mb-4">
          <FormizStep name="step1">
            <MyField
              name="firstName"
              label="First Name"
              isRequired="First Name is required"
            />
          </FormizStep>
          <FormizStep name="step2">
            <MyField
              name="lastName"
              label="Last Name"
              isRequired="Last Name is required"
            />
          </FormizStep>
        </div>

        <div className="flex flex-wrap items-center p-4 bg-gray-100 mt-auto">
          <div className="mr-auto" style={{ minWidth: '6rem' }}>
            {!myForm.isFirstStep && (
              <Button
                type="button"
                onClick={myForm.prevStep}
              >
                Previous
              </Button>
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
              <Button
                color="primary"
                type="submit"
                isDisabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </Button>
            ) : (
              <Button
                color="primary"
                type="button"
                onClick={myForm.submitStep}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </form>
    </Formiz>
  )
}
`;

export const Render = `
render(
  <MyForm />
)
`;
