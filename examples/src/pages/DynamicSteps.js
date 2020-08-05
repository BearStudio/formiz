import React from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { isMinNumber, isMaxNumber } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';

const MAX_STEPS = 10;
const minMax = (min, max) => (value) => Math.max(Math.min(parseInt(value, 10), max), min);

export const DynamicSteps = () => {
  const form = useForm();
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
          <PageHeader githubPath="DynamicSteps.js">
            Dynamic Steps
          </PageHeader>
          <FormizStep name="start" order={1000}>
            <FieldInput
              name="count"
              label="Steps Count"
              type="number"
              required="Required"
              defaultValue={2}
              formatValue={minMax(1, 10)}
              validations={[
                {
                  rule: isMinNumber(1),
                  message: 'Min steps count is 1',
                },
                {
                  rule: isMaxNumber(MAX_STEPS),
                  message: 'Max steps count is 10',
                },
              ]}
            />
          </FormizStep>
          {[...Array(form.values.count || 0)].map((x, index) => (
            <FormizStep
              key={index} // eslint-disable-line
              name={`dynamic-${index}`}
              order={2000 + index}
            >
              <FieldInput
                name={`steps[${index}].name`}
                label={`Dynamic Step ${index + 1} Name`}
              />
            </FormizStep>
          ))}
          <FormizStep name="end" order={3000}>
            <FieldInput
              name="end"
              label="End"
              required="Required"
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
                colorScheme="brand"
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
