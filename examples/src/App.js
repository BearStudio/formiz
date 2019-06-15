import React from 'react';
import { Formiz, FormizStep, useFormiz } from '@formiz/core';

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const isRequired = () => x => !!x;
const isEmail = () => x => !x || emailRegex.test(x);
const isNotEqual = (val) => x => (x || '').toLowerCase() !== (val || '').toLowerCase();

const Input = (props) => {
  const {
    value, setValue, errorMessage, isValid, isPristine,
  } = useFormiz(props);
  const { label } = props; // eslint-disable-line
  const [isTouched, setIsTouched] = React.useState(false);

  const isError = !isValid && (!isPristine || isTouched);

  return (
    <div className="form-group">
      <label style={{ display: 'block' }}>
        {label}
      </label>
      <input
        className={`form-control ${isError ? 'is-invalid' : ''}`}
        defaultValue={value}
        onChange={e => setValue(e.target.value.trim())}
        onBlur={() => {
          setIsTouched(true);
        }}
      />
      {isError && (
        <div className="invalid-feedback">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

function App() {
  const [isJobFieldVisible, setIsJobFieldVisible] = React.useState(false);
  const [isStep2Visible, setIsStep2Visible] = React.useState(true);
  const [formIsValid, setFormIsValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    console.log(values); // eslint-disable-line

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div style={{ padding: '2rem' }}>
        <button className="btn btn-light btn-sm" type="button" onClick={() => setIsStep2Visible(!isStep2Visible)}>
          Toggle Step 2
        </button>
      </div>
      <div style={{ padding: '2rem' }}>
        <Formiz
          onSubmit={handleSubmit}
        >
          {({
            submit,
            isValid,
            isStepValid,
            currentStep,
            nextStep,
            prevStep,
            goToStep,
            isFirstStep,
            isLastStep,
            steps,
          }) => (
            <form className="card">
              <div className="card-body" style={{ minHeight: 200 }}>
                <FormizStep name="step3" order={3}>
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

                <FormizStep name="step1" order={1}>
                  <Input
                    name="name"
                    label="Name"
                    defaultValue="john"
                    validations={[
                      {
                        rule: isNotEqual(isStep2Visible ? 'john' : 'toto'),
                        message: `Not ${isStep2Visible ? 'john' : 'toto'}`,
                        dependencies: [isStep2Visible],
                      },
                      {
                        rule: isRequired(),
                        message: 'Required',
                      },
                    ]}
                  />

                </FormizStep>

                {!isStep2Visible && currentStep.name === 'step2' && goToStep('step1')}
                {isStep2Visible && (
                  <FormizStep name="step2" order={2}>
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
                <button className="btn btn-link" type="button" onClick={prevStep} disabled={isFirstStep}>
                  Prev
                </button>

                <div className="mx-auto">
                  {steps.map(step => (
                    <button
                      key={step.name}
                      type="button"
                      onClick={() => goToStep(step.name)}
                      disabled={!step.isVisited}
                      className={`
                        btn btn-sm rounded-pill py-0 mx-1
                        ${currentStep.name === step.name ? 'btn-primary' : 'btn-link'}
                      `}
                    >
                      {step.isValid ? '✅' : '⚠️'}
                      {' '}
                      {step.name}
                    </button>
                  ))}
                </div>

                {isLastStep
                  ? (
                    <button className="btn btn-primary ml-auto" type="button" onClick={submit} disabled={!isValid || isLoading}>
                      { isLoading ? 'Loading... ' : 'Submit' }
                    </button>
                  )
                  : (
                    <button className="btn btn-primary ml-auto" type="button" onClick={nextStep} disabled={!isStepValid}>
                      Next
                    </button>
                  )
                }
              </div>
            </form>
          )}
        </Formiz>
      </div>

      <div style={{ padding: '2rem' }}>
        <Formiz
          onSubmit={handleSubmit}
          onValid={() => setFormIsValid(true)}
          onInvalid={() => setFormIsValid(false)}
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
        <Formiz onSubmit={handleSubmit}>
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
