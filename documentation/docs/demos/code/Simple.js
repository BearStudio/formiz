import { MyField } from './MyField';
import { FieldsStep1 } from './FieldsStep1';
import { FieldsStep2 } from './FieldsStep2';
import { FieldsStep3 } from './FieldsStep3';

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
        <div className="demo-form__content">
          ${FieldsStep1()}
          ${FieldsStep2()}
          ${FieldsStep3()}
        </div>

        <div className="demo-form__footer">
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
