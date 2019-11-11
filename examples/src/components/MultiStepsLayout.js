import React from 'react';
import PropTypes from 'prop-types';
import { Formiz, useForm } from '@formiz/core';
import { Box, Grid, Button } from '@chakra-ui/core';
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
      <PageLayout>
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
                {form.isLastStep ? submitLabel : 'Next'}
              </Button>
            </Grid>
          )}
        </form>
      </PageLayout>
    </Formiz>
  );
};

MultiStepsLayout.propTypes = propTypes;
MultiStepsLayout.defaultProps = defaultProps;
