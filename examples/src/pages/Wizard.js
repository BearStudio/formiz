import React from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { Debug } from '../components/Debug';

export const Wizard = () => {
  const form = useForm();

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
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
      <form
        noValidate
        onSubmit={form.submitStep}
      >
        <PageHeader>
          Wizard
        </PageHeader>
        <FormizStep name="step1">
          <FieldInput
            name="name"
            label="Name"
            isRequired="Required"
          />
        </FormizStep>
        <FormizStep name="step2">
          <FieldInput
            name="email"
            label="Email"
            type="email"
            isRequired="Required"
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
              Step
              {' '}
              {form.currentStep.index + 1}
              {' '}
              /
              {' '}
              {form.steps.length}
            </Box>
            <Button
              type="submit"
              gridColumn="3"
              variantColor="brand"
              isDisabled={!form.isValid && form.isSubmitted}
            >
              {form.isLastStep ? 'Submit' : 'Next'}
            </Button>
          </Grid>
        )}
      </form>
      <Debug />
    </Formiz>
  );
};
