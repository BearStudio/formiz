import React from 'react';
import { useForm } from '@formiz/core';
import { Box, Grid, Button } from '@chakra-ui/react';
import { PageLayout } from '../layout/PageLayout';

export const MultiStepsLayout = ({
  children,
  submitLabel = 'Submit',
  ...props
}) => {
  const form = useForm({ subscribe: 'form' });
  const hasSteps = !!form?.steps?.length;

  return (
    <PageLayout {...props}>
      <form noValidate onSubmit={hasSteps ? form.submitStep : form.submit}>
        {children}

        {hasSteps && (
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
              Step {(form.currentStep?.index ?? 0) + 1} / {form.steps?.length}
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
              {form.isLastStep ? submitLabel : 'Next'}
            </Button>
          </Grid>
        )}
      </form>
    </PageLayout>
  );
};
