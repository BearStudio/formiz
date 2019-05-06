import React from 'react';
import { Formiz, useFormiz } from '@formiz/core';

const Input = (props) => {
  const {
    value, setValue, errorMessage, isValid,
  } = useFormiz(props);
  const { label } = props;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block' }}>
        {label}
      </label>
      <input
        style={{ borderColor: isValid ? null : 'red' }}
        defaultValue={value}
        onChange={e => setValue(e.target.value.trim())}
      />
      {!isValid && (
        <div style={{ color: 'red' }}>
          <small>
            {errorMessage}
          </small>
        </div>
      )}
    </div>
  );
};

function App() {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div>
      <div style={{ padding: '2rem' }}>
        <Formiz>

          <Input
            name="name"
            label="Name"
            validations={[
              {
                rule: x => (x || '').toLowerCase() !== 'john',
                message: 'Not john',
              },
            ]}
          />

          {isVisible && (
            <Input name="job" label="Job" />
          )}

          <button type="button" onClick={() => setIsVisible(!isVisible)}>
            Toggle Job
          </button>

          <button type="submit">
            Submit
          </button>
        </Formiz>
      </div>

      <div style={{ padding: '2rem' }}>
        <Formiz>
          <Input name="name" label="Name" />

          <button type="submit">
            Submit
          </button>
        </Formiz>
      </div>
    </div>
  );
}

export default App;
