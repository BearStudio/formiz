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
import { Formiz, useForm, useFormContext, useFormFields } from "@formiz/core";
import Link from "next/link";

import { FieldInput } from "@/components/FieldInput";
import { FieldObject } from "@/components/FieldObject";
import { DebugRender } from "@/components/DebugRender";
import { useForceUpdate } from "@/hooks/useForceUpdate";

const ChildComponent: React.FC<{ children?: React.ReactNode }> = ({
  children,
  ...rest
}) => {
  const { isValid, isPristine } = useFormContext();
  return (
    <Alert borderRadius="sm" {...rest}>
      <DebugRender mr="4" />
      Child Component {children}
      {isValid ? "✅ Valid" : "❌ Invalid"}{" "}
      {isPristine ? "✨ Pristine" : "👀 Dirty"}
    </Alert>
  );
};

const ChildComponentMemo: React.FC<any> = React.memo(
  ({ children, ...rest }) => {
    const { isValid, isPristine } = useFormContext();
    return (
      <Alert borderRadius="sm" {...rest}>
        <DebugRender mr="4" />
        Child Component Memo {children}
        {isValid ? "✅ Valid" : "❌ Invalid"}{" "}
        {isPristine ? "✨ Pristine" : "👀 Dirty"}
      </Alert>
    );
  }
);

ChildComponentMemo.displayName = "ChildComponentMemo";

const Debug = React.memo(() => {
  const fields = useFormFields({
    fields: ["async", "objectValue", "nested"] as const,
    selector: (field) => field.value,
  });
  const debug = fields;
  return (
    <Code as="pre" w="full" py="2" px="4">
      <DebugRender mr="4" />
      {JSON.stringify(debug, null, 2)}
    </Code>
  );
});

Debug.displayName = "Debug";

const Index = () => {
  const forceUpdate = useForceUpdate();
  const form = useForm();

  const handleSubmit = (values: any) => {
    console.log({ submit: values });
  };

  const handleValidSubmit = (values: any) => {
    console.log({ validSubmit: values });
  };

  const handleInvalidSubmit = (values: any) => {
    console.log({ invalidSubmit: values });
  };

  const debug = form;

  return (
    <Formiz
      connect={form}
      onSubmit={handleSubmit}
      onValidSubmit={handleValidSubmit}
      onInvalidSubmit={handleInvalidSubmit}
    >
      <Stack direction="row" m="auto" maxW="8xl" p="8" spacing="8">
        <Box flex="3">
          <Heading mb="8">Formiz v2 • Code Retreat</Heading>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              form.submit();
            }}
          >
            <Stack direction="row" spacing="8">
              <Stack spacing="4">
                <Link href="/debug/other" passHref>
                  <Button as="a">Go to /other</Button>
                </Link>
                <Link href="/debug/steps" passHref>
                  <Button as="a">Go to /steps</Button>
                </Link>
                <Button colorScheme="red" onClick={() => forceUpdate()}>
                  Force Update Root
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() =>
                    form.setValues({
                      lastName: null,
                      nested: {
                        a: "Nested element",
                      },
                      objectValue: { id: 2, label: "Object B" },
                      "email-0": "Hello 0",
                      "email-1": "Hello 1",
                      "email-2": "Hello 2",
                      "email-3": "Hello 3",
                      "email-4": "Hello 4",
                    })
                  }
                >
                  Set Values
                </Button>
                <Alert borderRadius="sm">
                  <DebugRender mr="4" />
                  Root Component
                </Alert>
                <ChildComponent />
                <ChildComponentMemo />
                {form.isSubmitted && (
                  <Alert status="success" borderRadius="sm">
                    Submitted
                  </Alert>
                )}
              </Stack>
              <Stack spacing="4" flex="1">
                <Flex justify="space-between">
                  <Button onClick={() => form.reset()}>Reset</Button>
                  <Button type="submit" colorScheme="blue">
                    Submit
                  </Button>
                </Flex>
                <Divider />
                <FieldInput
                  name="async"
                  label="Async Validations"
                  helper="nope after 2s"
                  required="Required"
                  debounceValidationsAsync={500}
                  validationsAsync={[
                    {
                      handler: async (value) => {
                        return new Promise((resolve) => {
                          setTimeout(() => {
                            resolve(value !== "nope");
                          }, 2000);
                        });
                      },
                      message: "Async validation",
                    },
                  ]}
                />
                <FieldInput
                  name="firstname"
                  label="First Name"
                  helper="2s debounce and not hello"
                  debounceValidationsAsync={2000}
                  validations={[
                    {
                      handler: (value) => value !== "hello",
                      message: "Error",
                      deps: [],
                    },
                  ]}
                />
                <FieldInput
                  name="lastName"
                  label="Last Name"
                  required="Required"
                />
                <FieldInput
                  name="nested.a"
                  label="Nested A"
                  required="Required"
                />
                <FieldInput
                  name="nested.b"
                  label="Nested B"
                  required="Required"
                />
                <FieldObject
                  name="objectValue"
                  label="Object Value"
                  options={[
                    { id: 1, label: "Object A" },
                    { id: 2, label: "Object B" },
                    { id: 3, label: "Object C" },
                  ]}
                  validations={[
                    {
                      handler: () => true,
                      message: "Error",
                      deps: [],
                    },
                  ]}
                />
                {Array.from({ length: 400 }, (_, index) => (
                  <FieldInput
                    key={index}
                    name={`email-${index}`}
                    label={`Email • ${index}`}
                    validations={[
                      {
                        handler: (value) => value !== "hello",
                        message: "Error",
                        deps: [],
                      },
                    ]}
                  />
                ))}
              </Stack>
            </Stack>
          </form>
        </Box>
        <Stack flex="2">
          <Heading>Debug</Heading>
          <Code as="pre" w="full" py="2" px="4">
            {JSON.stringify(debug, null, 2)}
          </Code>
          <Debug />
        </Stack>
      </Stack>
    </Formiz>
  );
};

export default Index;
