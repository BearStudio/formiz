import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Box, Grid, Button } from '@chakra-ui/core';
import { Debug } from './Debug';

export const MultiStepsLayout = ({
  form: externalForm,
  children,
  submitLabel = 'Submit',
  ...props
}) => {
  const internalForm = useForm();
  const form = externalForm || internalForm;
  const hasSteps = !!form.steps.length;

  return (
    <Formiz connect={form} {...props}>
      <form
        noValidate
        onSubmit={hasSteps ? form.submitStep : form.submit}
      >
        {children}

        {hasSteps && (
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
              isDisabled={
                (form.isLastStep ? !form.isValid : !form.isStepValid)
                && form.isStepSubmitted
              }
            >
              {form.isLastStep ? submitLabel : 'Next'}
            </Button>
          </Grid>
        )}
      </form>

      <Debug />
    </Formiz>
  );
};
