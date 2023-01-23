import { FieldInput } from "@/components/FieldInput";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Box, Button, Grid, Stack } from "@chakra-ui/react";
import { Formiz, FormizStep, useForm } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import { NextPage } from "next";
import { useState } from "react";

const fakeDelay = (delay = 500) => new Promise((r) => setTimeout(r, delay));

const Wizard: NextPage = () => {
  const form = useForm();
  const [status, setStatus] = useState("idle");
  const isLoading = status === "loading" || form.isValidating;

  /**
   * Hook into the submitStep method to handle some actions before changing step
   * If you don't need this you can just call the onSubmit={form.submitStep} on your <form>
   */
  const handleSubmitStep = async (event: any) => {
    event.preventDefault();
    if (
      !form.currentStep ||
      !form.currentStep?.isValid ||
      !form.currentStep?.name
    ) {
      form.submitStep();
      return;
    }

    setStatus("loading");
    console.log(`Submitting ${form.currentStep?.name}...`); // eslint-disable-line no-console
    await fakeDelay();

    setStatus("success");
    form.submitStep();
  };

  /**
   * Handle the complete form submit
   */
  const handleSubmit = async (values: any) => {
    setStatus("loading");
    console.log("Submitting form...", values); // eslint-disable-line no-console
    await fakeDelay();
    setStatus("success");

    console.log(values);
    form.setErrors({
      name: "You can display an error after an API call",
    });
    const stepWithError = form.getStepByFieldName("name");
    if (stepWithError) {
      form.goToStep(stepWithError.name);
    }
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit}>
      <PageLayout>
        <form noValidate onSubmit={handleSubmitStep}>
          <Stack spacing={4}>
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
                    handler: isEmail(),
                    message: "Not a valid email",
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
                  Step {(form.currentStep?.index ?? 0) + 1} /{" "}
                  {form.steps.length}
                </Box>
                <Button
                  type="submit"
                  gridColumn="3"
                  isLoading={isLoading}
                  isDisabled={
                    (form.isLastStep ? !form.isValid : !form.isStepValid) &&
                    form.isStepSubmitted
                  }
                >
                  {form.isLastStep ? "Submit" : "Next"}
                </Button>
              </Grid>
            )}
          </Stack>
        </form>
      </PageLayout>
    </Formiz>
  );
};

export default Wizard;
