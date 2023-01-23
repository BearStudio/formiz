import { Button, Code, Flex, HStack, Spinner, Stack } from "@chakra-ui/react";
import { Formiz, useForm, useFormFields } from "@formiz/core";
import type { NextPage } from "next";
import { FieldInput } from "../../components/FieldInput";
import { FieldSelect } from "../../components/FieldSelect";

const Home: NextPage = () => {
  const form = useForm();
  const x = useFormFields({
    fields: ["nested.field"],
    selector: (f) => [f.formattedValue, f.value],
    connect: form,
  });

  console.log("--", x.nested?.field);

  return (
    <Flex as="section" direction="column" minH="100vh" p="8">
      {x.nested?.field}
      <Formiz
        autoForm
        connect={form}
        initialValues={{
          array: [{ field: "Initial Value" }],
        }}
        onValidSubmit={(values) => console.log(values)}
      >
        <Stack spacing="4" align="start">
          <Button
            onClick={() => {
              form.setValues({ async: "nope", nested: { field: "plop" } });
            }}
          >
            Click me
          </Button>
          <Button
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>
          <FieldInput
            name="firstName"
            label="First Name"
            required="First Name is required"
            helper="2s debounce"
            debounceValidationsAsync={2000}
          />
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
            name="nested.field"
            label="Nested Field"
            required="Nested Field is required"
            onValueChange={console.log}
            formatValue={(v) => v?.length ?? 0}
          />
          <FieldInput
            name="array[0].field"
            label="Array Field 0"
            required="Array Field is required"
            defaultValue="test"
          />
          <FieldInput
            name="array[1].field"
            label="Array Field 1"
            required="Array Field is required"
          />
          <FieldInput
            name="lastName"
            label="Last Name"
            helper="Do not use `doe`"
            validations={[
              {
                handler: (v) => !v || v !== "doe",
                message: "You can't use `doe`",
              },
            ]}
          />
          <FieldSelect
            name="role"
            label="Role"
            placeholder="Select..."
            required="Role is required"
            defaultValue="user"
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />
          <HStack spacing="4">
            <Button
              type="submit"
              isDisabled={!form.isValid && form.isSubmitted}
            >
              Submit
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
