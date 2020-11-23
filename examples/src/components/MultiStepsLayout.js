import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from '@formiz/core';
import { Box, Grid, Button } from '@chakra-ui/react';
import { PageLayout } from '../layout/PageLayout';

const propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  form: PropTypes.object,
  children: PropTypes.node,
  submitLabel: PropTypes.node,
};
const defaultProps = {
  form: null,
  children: '',
  submitLabel: '',
};

export const MultiStepsLayout = ({
  children,
  submitLabel = 'Submit',
  ...props
}) => {
  const form = useForm({ subscribe: 'form' });
  const hasSteps = !!form.steps.length;

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
              {form.isLastStep ? submitLabel : 'Next'}
            </Button>
          </Grid>
        )}
      </form>
    </PageLayout>
  );
};

MultiStepsLayout.propTypes = propTypes;
MultiStepsLayout.defaultProps = defaultProps;
