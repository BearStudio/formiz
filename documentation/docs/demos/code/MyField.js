export const MyField = `
// 1. Create a reusable field
const MyField = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    resetKey,
    setValue,
    value,
  } = useField(props)
  const { label, type, required } = props
  const [isFocused, setIsFocused] = React.useState(false);
  const showError = !isValid && !isFocused && (!isPristine || isSubmitted)

  return (
    <div className={\`demo-form-group \${showError ? 'is-error' : ''}\`}>
      <label
        className="demo-label"
        htmlFor={id}
      >
        { label }
        {required && ' *'}
      </label>
      <input
        key={resetKey}
        id={id}
        type={type || 'text'}
        value={value || ''}
        className="demo-input"
        onChange={e => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? \`\${id}-error\` : null}
      />
      {showError && (
        <div id={\`\${id}-error\`} className="demo-form-feedback">
          { errorMessage }
        </div>
      )}
    </div>
  )
}
`;
