import {
  Button,
  ButtonGroup,
  Code,
  Flex,
  HStack,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Formiz, FormizStep, useForm } from "@formiz/core";
import type { NextPage } from "next";
import { FieldInput } from "../../components/FieldInput";
import { FieldSelect } from "../../components/FieldSelect";

const Home: NextPage = () => {
  const form = useForm();

  return (
    <Flex as="section" direction="column" minH="100vh" p="8">
      <Formiz
        autoForm="step"
        connect={form}
        onValidSubmit={(values) => console.log(values)}
        initialStepName="step-2"
        id="myForm"
      >
        <Stack spacing="4" align="start">
          <ButtonGroup>
            <Button onClick={() => form.goToStep("step-1")}>Step 1</Button>
            <Button onClick={() => form.goToStep("step-2")}>Step 2</Button>
            <Button onClick={() => form.goToStep("step-3")}>Step 3</Button>
            <Button onClick={() => form.reset()}>Reset</Button>
          </ButtonGroup>
          <FormizStep name="step-1">
            <FieldInput name="firstName" label="First Name" />
          </FormizStep>
          <FormizStep name="step-2">
            <FieldInput name="lastName" label="Last Name" />
          </FormizStep>
          <FormizStep name="step-3">
            <FieldInput name="email" label="Email" type="email" />
          </FormizStep>
          <HStack spacing="4">
            <Button
              type="submit"
              isDisabled={!form.isValid && form.isSubmitted}
            >
              Submit Form
            </Button>
            {form.isValidating && <Spinner size="sm" opacity="0.4" />}
          </HStack>
          <Code as="pre">{JSON.stringify(form, null, 2)}</Code>
        </Stack>
      </Formiz>
    </Flex>
  );
};

export default Home;
