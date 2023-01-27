import React, { FC, PropsWithChildren } from "react";
import { useFormContext } from "@formiz/core";
import { Box, Grid, Button } from "@chakra-ui/react";
import { PageLayout } from "@/layout/PageLayout";

export const MultiStepsLayout: FC<
  PropsWithChildren<{ submitLabel: string }>
> = ({ children, submitLabel = "Submit", ...props }) => {
  const form = useFormContext();
  const hasSteps = !!form?.steps?.length;

  return (
    <PageLayout {...props}>
      {children}

      {hasSteps && (
        <Grid templateColumns="1fr 2fr 1fr" alignItems="center" mt={4}>
          {!form.isFirstStep && (
            <Button gridColumn="1" onClick={form.goToPreviousStep}>
              Previous
            </Button>
          )}
          <Box gridColumn="2" textAlign="center" fontSize="sm" color="gray.500">
            Step {(form.currentStep?.index ?? 0) + 1} / {form.steps?.length}
          </Box>
          <Button
            type="submit"
            gridColumn="3"
            isDisabled={
              (form.isLastStep ? !form.isValid : !form.isStepValid) &&
              form.isStepSubmitted
            }
          >
            {form.isLastStep ? submitLabel : "Next"}
          </Button>
        </Grid>
      )}
    </PageLayout>
  );
};
