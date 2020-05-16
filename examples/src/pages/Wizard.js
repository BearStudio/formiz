import React from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';

export const Wizard = () => {
  const form = useForm({ stateLevel: 'form' });
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);
    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('name');
    form.goToStep(stepWithError);
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
    >
      <PageLayout>
        <form
          noValidate
          onSubmit={form.submitStep}
        >
          <PageHeader githubPath="Wizard.js">
            Wizard
          </PageHeader>
          <FormizStep name="step1">
            <FieldInput
              name="name"
              label="Name"
              required="Required"
            />
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
            <FieldInput
              name="company"
              label="Company"
            />
          </FormizStep>
          {!!form.steps.length && (
            <Grid templateColumns="1fr 2fr 1fr" alignItems="center">
              {!form.isFirstStep && (
                <Button
                  gridColumn="1"
                  onClick={form.prevStep}
                >
                  Previous
                </Button>
              )}
              <Box
                gridColumn="2"
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Step {form.currentStep.index + 1} / {form.steps.length}
              </Box>
              <Button
                type="submit"
                gridColumn="3"
                variantColor="brand"
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
