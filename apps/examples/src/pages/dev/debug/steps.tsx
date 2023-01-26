import React from "react";

import {
  Alert,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { Formiz, useForm, useFormContext, FormizStep } from "@formiz/core";
import Link from "next/link";

import { FieldInput } from "@/components/FieldInput";
import { DebugRender } from "@/components/DebugRender";
import { useForceUpdate } from "@/hooks/useForceUpdate";

const ChildComponent: React.FC<{ children?: React.ReactNode }> = ({
  children,
  ...rest
}) => {
  const { isValid } = useFormContext();
  return (
    <Alert borderRadius="sm" {...rest}>
      <DebugRender mr="4" />
      Child Component {children}
      {isValid ? "VALID" : "NOPE"}
    </Alert>
  );
};

const ChildComponentMemo: React.FC<any> = React.memo(
  ({ children, ...rest }) => {
    const { isValid } = useFormContext();
    return (
      <Alert borderRadius="sm" {...rest}>
        <DebugRender mr="4" />
        Child Component Memo {children}
        {isValid ? "VALID" : "NOPE"}
      </Alert>
    );
  }
);

ChildComponentMemo.displayName = "ChildComponentMemo";

const Debug = () => {
  const debug = "something to debug in a child component";
  return (
    <Code as="pre" w="full" py="2" px="4">
      {JSON.stringify(debug, null, 2)}
    </Code>
  );
};

const Steps = () => {
  const forceUpdate = useForceUpdate();
  const form = useForm();

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  const debug = form;

  return (
    <Stack direction="row" m="auto" maxW="8xl" p="8" spacing="8">
      <Box flex="3">
        <Heading mb="8">Formiz v2 • Code Retreat</Heading>
        <Formiz connect={form} onSubmit={handleSubmit}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.submit();
            }}
          >
            <Stack direction="row" spacing="8">
              <Stack spacing="4">
                <Button href="/debug/other" as={Link}>
                  Go to /other
                </Button>
                <Button href="/debug" as={Link}>
                  Go to /
                </Button>
                <Button colorScheme="red" onClick={() => forceUpdate()}>
                  Force Update Root
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => form.goToStep("step1")}
                >
                  Step 1
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => form.goToStep("step2")}
                >
                  Step 2
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => form.goToStep("step3")}
                >
                  Step 3
                </Button>
                <Alert borderRadius="sm">
                  <DebugRender mr="4" />
                  Root Component
                </Alert>
                <ChildComponent />
                <ChildComponentMemo />
              </Stack>
              <Stack spacing="4" flex="1">
                <Flex justify="space-between">
                  <Button onClick={() => alert("TODO Reset")}>Reset</Button>
                  <Button type="submit" colorScheme="blue">
                    Submit
                  </Button>
                </Flex>
                <Divider />
                <FormizStep name="step1">
                  <FieldInput
                    name="step1"
                    label="Step 1"
                    validations={[
                      {
                        handler: (value) => value !== "hello",
                        message: "Error",
                        deps: [debug],
                      },
                    ]}
                  />
                </FormizStep>
                <FormizStep name="step2">
                  <FieldInput
                    name="step2"
                    label="Step 2"
                    validations={[
                      {
                        handler: (value) => value !== "hello",
                        message: "Error",
                        deps: [debug],
                      },
                    ]}
                  />
                </FormizStep>
                <FormizStep name="step3">
                  <FieldInput
                    name="step3"
                    label="Step 3"
                    validations={[
                      {
                        handler: (value) => value !== "hello",
                        message: "Error",
                        deps: [debug],
                      },
                    ]}
                  />
                </FormizStep>
              </Stack>
            </Stack>
          </form>
        </Formiz>
      </Box>
      <Stack flex="2">
        <Heading>Debug</Heading>
        <Code as="pre" w="full" py="2" px="4">
          {JSON.stringify(debug, null, 2)}
        </Code>
        <Debug />
      </Stack>
    </Stack>
  );
};

export default Steps;
