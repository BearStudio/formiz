import React from 'react';
import {
  Formiz,
  FormizStep,
  useField,
  useForm,
} from '@formiz/core';

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const isRequired = () => x => !!x;
const isEmail = () => x => !x || emailRegex.test(x);
const isNotEqual = val => x => (x || '').toLowerCase() !== (val || '').toLowerCase();

const Counter = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    setValue,
    value,
  } = useField(props);
  // eslint-disable-next-line
  const { label, isRequired } = props;
  const showError = !isValid && (!isPristine || isSubmitted);
  const [counter, setCounter] = React.useState(value || 0);

  const counterPlus = () => {
    const newCounter = counter + 1;
    setValue(newCounter);
    setCounter(newCounter);
  };

  const counterMinus = () => {
    const newCounter = counter - 1;
    setValue(newCounter);
    setCounter(newCounter);
  };

  return (
    <div className="form-group">
      <label
        style={{ display: 'block' }}
        htmlFor={id}
      >
        { label }
        {isRequired && ' *'}
      </label>
      <button type="button" className="btn mr-2" onClick={counterMinus}>
        -
      </button>
      {counter}
      <button type="button" className="btn ml-2" onClick={counterPlus}>
        +
      </button>
      {showError && (
        <div id={`${id}-error`} className="invalid-feedback">
          { errorMessage }
        </div>
      )}
    </div>
  );
};

const Input = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isPristine,
    isSubmitted,
    resetKey,
    setValue,
    value,
  } = useField(props);
  // eslint-disable-next-line
  const { label, type, isRequired } = props;
  const showError = !isValid && (!isPristine || isSubmitted);

  return (
    <div className="form-group">
      <label
        style={{ display: 'block' }}
        htmlFor={id}
      >
        { label }
        {isRequired && ' *'}
      </label>
      <input
        key={resetKey}
        id={id}
        type={type || 'text'}
        defaultValue={value}
        className={`form-control ${showError ? 'is-invalid' : ''}`}
        onChange={e => setValue(e.target.value)}
        aria-invalid={!isValid}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
      {showError && (
        <div id={`${id}-error`} className="invalid-feedback">
          { errorMessage }
        </div>
      )}
    </div>
  );
};

const SubFormComponent = () => {
  const { isValid, values } = useForm();

  return (
    <div className="alert alert-primary">
      {isValid ? 'Yep' : 'Nope'}
      {' '}
      {values.collection && values.collection[1].name}
    </div>
  );
};

function App() {
  const [isJobFieldVisible, setIsJobFieldVisible] = React.useState(false);
  const [isStep2Visible, setIsStep2Visible] = React.useState(true);
  const [formIsValid, setFormIsValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [repeater, setRepeater] = React.useState(['a', 'b']);
  const myFormRepeater = useForm();
  const myForm = useForm();

  const handleSubmit = (values) => {
    setIsLoading(true);
    console.log(values); // eslint-disable-line

    setTimeout(() => {
      setIsLoading(false);
      myForm.invalidateFields({
        name: 'Nope',
      });
    }, 1000);
  };

  const repeaterAddItem = () => {
    setRepeater(c => [...c, `id-${Math.random().toString(36).substr(2, 9)}`]); // `id-${Math.random().toString(36).substr(2, 9)}`
  };

  const repeaterRemoveItem = (id) => {
    setRepeater(c => c.filter(x => x !== id));
  };

  return (
    <div>
      <SubFormComponent />
      <div style={{ padding: '2rem' }}>
        <button className="btn btn-light btn-sm mr-2" type="button" onClick={() => setIsStep2Visible(!isStep2Visible)}>
          Toggle Step 2
        </button>
        <button className="btn btn-light btn-sm" type="button" onClick={() => myForm.reset()}>
          Reset Multi Step Form
        </button>
      </div>
      <div style={{ padding: '2rem' }}>
        <Formiz
          onSubmit={handleSubmit}
          connect={myFormRepeater}
        >
          <form onSubmit={myFormRepeater.submit}>
            <SubFormComponent />
            {repeater.map((itemId, index) => (
              <div key={itemId} className="d-flex">
                <div>
                  <Counter
                    label="Counter"
                    name={`collection[${index}].counter`}
                  />
                </div>
                <div className="mx-4">
                  <Input
                    name={`collection[${index}].name`}
                    label="Name"
                    validations={[
                      {
                        rule: isNotEqual(isStep2Visible ? 'john' : 'toto'),
                        message: `Not ${isStep2Visible ? 'john' : 'toto'}`,
                      },
                      {
                        rule: isRequired(),
                        message: 'Required',
                      },
                    ]}
                  />
                </div>
                <div className="mt-2">
                  <button type="button" className="btn mt-4" onClick={() => repeaterRemoveItem(itemId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn" onClick={() => repeaterAddItem()}>
              Add
            </button>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </Formiz>
      </div>

      <div style={{ padding: '2rem' }}>
        <Formiz
          onSubmit={handleSubmit}
          connect={myForm}
        >
          <form className="card" onSubmit={myForm.submitStep}>
            <div className="card-body" style={{ minHeight: 200 }}>
              <FormizStep name="step3" label="Step C" order={3}>
                <Input
                  name="email"
                  label="Email"
                  validations={[
                    {
                      rule: isEmail(),
                      message: 'Invalid email',
                    },
                  ]}
                />
              </FormizStep>

              <FormizStep name="step1" label="Step A">
                <Input
                  name="name"
                  label="Name"
                  defaultValue="john"
                  validations={[
                    {
                      rule: isNotEqual(isStep2Visible ? 'john' : 'toto'),
                      message: `Not ${isStep2Visible ? 'john' : 'toto'}`,
                    },
                    {
                      rule: isRequired(),
                      message: 'Required',
                    },
                  ]}
                />

              </FormizStep>

              {!isStep2Visible && myForm.currentStep.name === 'step2' && myForm.goToStep('step1')}
              {isStep2Visible && (
                <FormizStep name="step2" label="Step B" order={2}>
                  <button className="btn btn-light btn-sm mb-3" type="button" onClick={() => setIsJobFieldVisible(!isJobFieldVisible)}>
                    Toggle Job
                  </button>

                  {isJobFieldVisible && (
                    <Input
                      name="job"
                      label="Job"
                      validations={[
                        {
                          rule: isNotEqual('john'),
                          message: 'Not john',
                        },
                        {
                          rule: isRequired(),
                          message: 'Required',
                        },
                      ]}
                    />
                  )}
                </FormizStep>
              )}
            </div>

            <div className="card-footer d-flex align-items-center">
              <button className="btn btn-link" type="button" onClick={myForm.prevStep} disabled={myForm.isFirstStep}>
                Prev
              </button>

              <div className="mx-auto">
                {myForm.steps.map(step => (
                  <button
                    key={step.name}
                    type="button"
                    onClick={() => myForm.goToStep(step.name)}
                    disabled={!step.isVisited}
                    className={`
                      btn btn-sm rounded-pill py-0 mx-1
                      ${myForm.currentStep.name === step.name ? 'btn-primary' : 'btn-link'}
                    `}
                  >
                    {step.isValid ? '✅' : '⚠️'}
                    {' '}
                    {step.label}
                  </button>
                ))}
              </div>

              {myForm.isLastStep
                ? (
                  <button className="btn btn-primary ml-auto" type="submit" disabled={!myForm.isValid || isLoading}>
                    { isLoading ? 'Loading... ' : 'Submit' }
                  </button>
                )
                : (
                  <button className="btn btn-primary ml-auto" type="submit" disabled={!myForm.isStepValid}>
                    Next
                  </button>
                )
              }
            </div>
          </form>
        </Formiz>
      </div>

      <div style={{ padding: '2rem' }}>
        <Formiz
          onSubmit={handleSubmit}
          onValid={() => setFormIsValid(true)}
          onInvalid={() => setFormIsValid(false)}
          autoForm
        >
          <Input
            name="name"
            label="Name"
            defaultValue="john"
            validations={[
              {
                rule: isNotEqual(isStep2Visible ? 'john' : 'toto'),
                message: `Not ${isStep2Visible ? 'john' : 'toto'}`,
              },
              {
                rule: isRequired(),
                message: 'Required',
              },
            ]}
          />

          {[...Array(20)].map((_x, index) => (
            <Input
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              name={`name-${index}`}
              label={`Name ${index}`}
              validations={[
                {
                  rule: isNotEqual(isStep2Visible ? 'john' : 'toto'),
                  message: `Not ${isStep2Visible ? 'john' : 'toto'}`,
                },
                {
                  rule: isRequired(),
                  message: 'Required',
                },
              ]}
            />
          ))}

          <div>
            <button className="btn btn-light btn-sm mb-3" type="button" onClick={() => setIsJobFieldVisible(!isJobFieldVisible)}>
              Toggle Job
            </button>
            {isJobFieldVisible && (
              <Input
                name="job"
                label="Job"
                validations={[
                  {
                    rule: isNotEqual('john'),
                    message: 'Not john',
                  },
                  {
                    rule: isRequired(),
                    message: 'Required',
                  },
                ]}
              />
            )}
          </div>

          <button className="btn btn-primary" type="submit" disabled={!formIsValid}>
            Submit
          </button>
        </Formiz>
      </div>

      <div style={{ padding: '2rem' }}>
        <Formiz onSubmit={handleSubmit} autoForm>
          <Input name="name" label="Name" />

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </Formiz>
      </div>
    </div>
  );
}

export default App;
