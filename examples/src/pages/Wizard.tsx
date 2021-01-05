import React, { useState } from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/react';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';

const fakeDelay = (delay = 500) => new Promise((r) => setTimeout(r, delay));

export const Wizard = () => {
  const form = useForm({ subscribe: 'form' });
  const toastValues = useToastValues();
  const [status, setStatus] = useState('idle');
  const isLoading = status === 'loading' || form.isValidating;

  /**
   * Hook into the submitStep method to handle some actions before changing step
   * If you don't need this you can just call the onSubmit={form.submitStep} on your <form>
   */
  const handleSubmitStep = async (event) => {
    event.preventDefault();
    if (
      !form.currentStep
      || !form.currentStep?.isValid
      || !form.currentStep?.name
    ) {
      form.submitStep();
      return;
    }

    setStatus('loading');
    console.log(`Submitting ${form.currentStep?.name}...`); // eslint-disable-line no-console
    await fakeDelay();

    setStatus('success');
    form.submitStep();
  };

  /**
   * Handle the complete form submit
   */
  const handleSubmit = async (values) => {
    setStatus('loading');
    console.log('Submitting form...', values); // eslint-disable-line no-console
    await fakeDelay();
    setStatus('success');

    toastValues(values);
    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('name');
    if (stepWithError) {
      form.goToStep(stepWithError);
    }
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit}>
      <PageLayout>
        <form noValidate onSubmit={handleSubmitStep}>
          <PageHeader githubPath="Wizard.tsx">Wizard</PageHeader>
          <FormizStep name="step1">
            <FieldInput name="name" label="Name" required="Required" />
          </FormizStep>
          <FormizStep name="step2">
            <FieldInput
              name="email"
              label="Email"
              type="email"
              required="Required"
              validations={[
                {
                  rule: isEmail(),
                  message: 'Not a valid email',
                },
              ]}
            />
          </FormizStep>
          <FormizStep name="step3">
            <FieldInput name="company" label="Company" />
          </FormizStep>
          {!!form.steps?.length && (
            <Grid templateColumns="1fr 2fr 1fr" alignItems="center">
              {!form.isFirstStep && (
                <Button gridColumn="1" onClick={form.prevStep}>
                  Previous
                </Button>
              )}
              <Box
                gridColumn="2"
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Step {(form.currentStep?.index ?? 0) + 1} / {form.steps.length}
              </Box>
              <Button
                type="submit"
                gridColumn="3"
                colorScheme="brand"
                isLoading={isLoading}
                isDisabled={
                  (form.isLastStep ? !form.isValid : !form.isStepValid)
                  && form.isStepSubmitted
                }
              >
                {form.isLastStep ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          )}
        </form>
      </PageLayout>
    </Formiz>
  );
};
