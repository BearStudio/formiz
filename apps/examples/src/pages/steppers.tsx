import React, { FC, ReactNode } from "react";
import { Formiz, useForm, FormizStep, useFormContext } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import {
  Button,
  Box,
  Heading,
  Stack,
  AspectRatio,
  Grid,
  StackProps,
  BoxProps,
  ButtonProps,
  CSSObject,
  As,
} from "@chakra-ui/react";
import { FieldInput } from "@/components/FieldInput";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";

const PreviousButton = (props: ButtonProps) => {
  const form = useFormContext();

  if (form.isFirstStep) {
    return <Box />;
  }

  return (
    <Button
      size="sm"
      onClick={form.goToPreviousStep}
      variant="ghost"
      {...props}
    >
      Previous
    </Button>
  );
};

const NextButton = (props: ButtonProps) => {
  const form = useFormContext();
  return (
    <Button
      type="submit"
      size="sm"
      colorScheme="blue"
      isDisabled={
        (form.isLastStep ? !form.isValid : !form.isStepValid) &&
        form.isStepSubmitted
      }
      {...props}
    >
      {form.isLastStep ? "Submit" : "Next"}
    </Button>
  );
};

const StepperWrapper: FC<
  StackProps & { title: string; children: ReactNode }
> = ({ title, children, ...rest }) => (
  <Stack {...rest}>
    {title && <Heading fontSize="md">{title}</Heading>}
    <Box bg="gray.50" _dark={{ bg: "gray.900" }} p="4" borderRadius="md">
      <Grid templateColumns="1fr 2fr 1fr" alignItems="center">
        <Box>
          <PreviousButton />
        </Box>
        {children}
        <Box textAlign="right">
          <NextButton />
        </Box>
      </Grid>
    </Box>
  </Stack>
);

const SimpleStepper = (props: BoxProps) => {
  const form = useFormContext();

  return (
    <Box
      flex="1"
      textAlign="center"
      fontSize="sm"
      color="gray.500"
      _dark={{ color: "gray.100" }}
      {...props}
    >
      Step {(form.currentStep?.index ?? 0) + 1} / {form.steps?.length}
    </Box>
  );
};

const DotsStepper = (props: BoxProps) => {
  const form = useFormContext();
  const spacing = 4;

  return (
    <Stack
      direction="row"
      display="flex"
      alignItems="center"
      justifyContent="center"
      spacing={spacing}
      {...props}
    >
      {form.steps?.map((step) => {
        const defaultProps = {
          zIndex: 0,
          borderRadius: "full",
          border: "2px solid transparent",
          fontWeight: step.isCurrent || step.isVisited ? "bold" : undefined,
          outline: "none",
          fontSize: "xs",
          overflow: "visible !important",
          transition: "0.2s",
          _after:
            step.index !== 0
              ? {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  mt: "-1px",
                  mr: "2px",
                  top: "50%",
                  right: "100%",
                  bg:
                    step.isVisited || step.isCurrent ? "blue.500" : "gray.100",
                  h: "2px",
                  w: spacing,
                }
              : {},
          _dark: {
            _after: {
              bg: step.isVisited || step.isCurrent ? "blue.500" : "gray.700",
            },
          },
        };

        const inactiveProps = !step.isVisited
          ? {
              bg: "gray.100",
              color: "gray.400",
              _dark: {
                ...defaultProps._dark,
                bg: "gray.700",
                color: "gray.400",
              },
            }
          : {};

        const visitedProps =
          step.isVisited && !step.isCurrent
            ? {
                bg: "white",
                color: "blue.500",
                borderColor: "currentColor",
                as: "button" as As,
                type: "button",
                onClick: () => form.goToStep(step.name),
                _hover: {
                  bg: "blue.500",
                  color: "white",
                  borderColor: "blue.500",
                },
                _focusVisible: {
                  zIndex: 1,
                  boxShadow: "outline",
                },
                _dark: {
                  ...defaultProps._dark,
                  bg: "gray.800",
                  color: "blue.200",
                  borderColor: "blue.500",
                  _hover: {
                    bg: "blue.500",
                    color: "white",
                  },
                },
              }
            : {};

        const currentProps = step.isCurrent
          ? {
              zIndex: 1,
              bg: "blue.500",
              color: "white",
              _dark: {
                ...defaultProps._dark,
                bg: "blue.500",
                color: "white",
              },
            }
          : {};

        return (
          <AspectRatio key={step.name} w="6" ratio={1}>
            <Box
              {...defaultProps}
              {...inactiveProps}
              {...visitedProps}
              {...currentProps}
            >
              {step.index + 1}
            </Box>
          </AspectRatio>
        );
      })}
    </Stack>
  );
};

const Steppers = () => {
  const form = useForm();

  const handleSubmit = (values: {
    name?: string;
    email?: string;
    company?: string;
    job?: string;
  }) => {
    console.log(values);

    form.setErrors({
      name: "You can display an error after an API call",
    });
    const stepWithError = form.getStepByFieldName("name");
    if (stepWithError) {
      form.goToStep(stepWithError?.name);
    }
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit} autoForm="step">
      <PageLayout>
        <PageHeader githubPath="steppers.tsx">Steppers</PageHeader>
        <FormizStep name="step1">
          <FieldInput name="name" label="Name" />
        </FormizStep>
        <FormizStep name="step2">
          <FieldInput
            name="email"
            label="Email"
            type="email"
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
        <FormizStep name="step4">
          <FieldInput name="job" label="Job" />
        </FormizStep>

        <Stack spacing="6" mt="8">
          <StepperWrapper title="Simple stepper">
            <SimpleStepper />
          </StepperWrapper>
          <StepperWrapper title="Dots stepper">
            <DotsStepper />
          </StepperWrapper>
        </Stack>
      </PageLayout>
    </Formiz>
  );
};

export default Steppers;
