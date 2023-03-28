import { FieldInput } from "@/components/FieldInput";
import { FieldSelect } from "@/components/FieldSelect";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Box, Button, Grid, Stack } from "@chakra-ui/react";
import { Formiz, FormizStep, useForm } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import { NextPage } from "next";

const FIELDS_BY_STEP = 20;

const Wizard: NextPage = () => {
  const toastValues = useToastValues();

  const handleSubmit = (values: Record<string, string>) => {
    toastValues(values);

    form.setErrors({
      "user[0].name": "You can display an error after an API call",
    });

    const stepWithError = form.getStepByFieldName("user[0].name");
    if (stepWithError) {
      form.goToStep(stepWithError.name);
    }
  };

  const form = useForm({ onValidSubmit: handleSubmit });

  return (
    <Formiz connect={form} autoForm="step">
      <PageLayout>
        <PageHeader githubPath="lot-of-fields.tsx">Lot of fields</PageHeader>
        <Stack spacing={4}>
          <FormizStep name="step1">
            <Stack spacing={4}>
              {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
                <FieldInput
                  key={index}
                  name={`user[${index}].name`}
                  label={`Name ${index}`}
                  defaultValue="John"
                  required="Required"
                />
              ))}
            </Stack>
          </FormizStep>
          <FormizStep name="step2">
            <Stack spacing={4}>
              {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
                <FieldInput
                  key={index}
                  name={`user[${index}].email`}
                  label={`Email ${index}`}
                  defaultValue="john@doe.com"
                  required="Required"
                  validations={[
                    {
                      handler: isEmail(),
                      message: "Not a valid email",
                    },
                  ]}
                />
              ))}
            </Stack>
          </FormizStep>
          <FormizStep name="step3">
            <Stack spacing={4}>
              {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
                <FieldInput
                  key={index}
                  name={`user[${index}].company`}
                  label={`Company ${index}`}
                  defaultValue="Company co."
                  required="Required"
                />
              ))}
            </Stack>
          </FormizStep>
          <FormizStep name="step4">
            <Stack spacing={4}>
              {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
                <FieldSelect
                  key={index}
                  name={`user[${index}].country`}
                  label={`Country ${index}`}
                  required="Required"
                  placeholder="Choose a country..."
                  defaultValue="us"
                  options={[
                    {
                      value: "fr",
                      label: "France",
                    },
                    {
                      value: "us",
                      label: "United States",
                    },
                  ]}
                />
              ))}
            </Stack>
          </FormizStep>
          {!!form.steps?.length && (
            <Grid templateColumns="1fr 2fr 1fr" alignItems="center">
              {!form.isFirstStep && (
                <Button gridColumn="1" onClick={form.goToPreviousStep}>
                  Previous
                </Button>
              )}
              <Box
                gridColumn="2"
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Step {(form.currentStep?.index ?? 0) + 1} / {form.steps.length}
              </Box>
              <Button
                type="submit"
                gridColumn="3"
                isDisabled={
                  form.isLastStep
                    ? !form.isValid && form.isSubmitted
                    : !form.isStepValid && form.isStepSubmitted
                }
              >
                {form.isLastStep ? "Submit" : "Next"}
              </Button>
            </Grid>
          )}
        </Stack>
      </PageLayout>
    </Formiz>
  );
};

export default Wizard;
