export const MyField = `
// 1. Create a reusable field
const MyField = (props) => {
  const {
    value, setValue, errorMessage, isValid, isPristine, isSubmitted, resetKey
  } = useField(props)
  const { label, type } = props
  const showError = !isValid && (!isPristine || isSubmitted)
  return (
    <div className="demo-form-group">
      <label className="demo-label">
        { label }
      </label>
      <input
        key={resetKey}
        type={type || 'text'}
        defaultValue={value}
        className={\`demo-input \${showError ? 'is-error' : ''}\`}
        onChange={e => setValue(e.target.value)}
      />
      {showError && (
        <div className="demo-form-error">
          { errorMessage }
        </div>
      )}
    </div>
  )
}
`;
