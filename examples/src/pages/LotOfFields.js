import React from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';

export const LotOfFields = () => {
  const form = useForm();

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    form.invalidateFields({
      'name-0': 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('name-0');
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
          <PageHeader>
            Lot of fields
          </PageHeader>
          <FormizStep name="step1">
            {[...Array(10)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].name`}
                label={`Name ${index}`}
                defaultValue="John"
                isRequired="Required"
              />
            ))}
          </FormizStep>
          <FormizStep name="step2">
            {[...Array(10)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].email`}
                label={`Email ${index}`}
                defaultValue="john@doe.com"
                isRequired="Required"
                validations={[
                  {
                    rule: isEmail(),
                    message: 'Not a valid email',
                  },
                ]}
              />
            ))}
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
      </PageLayout>
    </Formiz>
  );
};
