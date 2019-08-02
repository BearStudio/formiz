/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Formiz, FormizStep, useForm } from '@formiz/core';
import { MyField } from './MyField';
import { Button } from './Button';

export const MyForm = () => {
  const [myForm, myFormConnector] = useForm();
  const submitForm = (values) => {
    console.log(values); // { firstName: 'value', lastName: 'value' }
  };
  return (
    <div>
      <Formiz onValidSubmit={submitForm} connect={myFormConnector}>
        <form
          onSubmit={myForm.submit}
          className="flex flex-col border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{ minHeight: '16rem' }}
        >
          <div className="p-4 mb-4">
            <FormizStep name="step1" order={1}>
              <MyField
                name="firstName"
                label="First Name"
                isRequired="First Name is required"
              />
            </FormizStep>
            <FormizStep name="step2" order={2}>
              <MyField
                name="lastName"
                label="Last Name"
                isRequired="Last Name is required"
              />
            </FormizStep>
          </div>

          <div className="flex items-center p-4 bg-gray-100 mt-auto">
            <div className="mr-auto" style={{ minWidth: '6rem' }}>
              {!myForm.isFirstStep && (
                <Button type="button" onClick={myForm.prevStep}>
                Previous
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Step {myForm.currentStep && myForm.currentStep.order} of {myForm.steps.length}
            </div>
            <div className="ml-auto" style={{ minWidth: '6rem' }}>
              {myForm.isLastStep ? (
                <Button color="primary" type="submit" isDisabled={!myForm.isValid}>
                  Submit
                </Button>
              ) : (
                <Button color="primary" type="button" onClick={myForm.nextStep} isDisabled={!myForm.isStepValid}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </Formiz>
    </div>
  );
};
