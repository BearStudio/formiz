import { DebugRender } from "@/components/DebugRender";
import { FieldInput } from "@/components/FieldInput";
import { Box, Button, ButtonGroup, Code, Flex, Stack } from "@chakra-ui/react";
import { Formiz, FormizStep, useForm, useFormFields } from "@formiz/core";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Playground: NextPage = () => {
  const form = useForm();
  const values = useFormFields({
    connect: form,
    fields: ["firstName", "nested"],
    selector: (field) => field.isDebouncing,
  });

  const [rand, setRand] = useState(Math.random());

  const [keys, setKeys] = useState([Math.random(), Math.random()]);
  useEffect(() => {
    setKeys([Math.random(), Math.random()]);
  }, [form.resetKey]);

  return (
    <Flex as="section" direction="column" minH="100vh" p="8">
      <Formiz
        autoForm="step"
        connect={form}
        onValidSubmit={(values) => console.log(values)}
      >
        <Stack>
          <ButtonGroup>
            <Button
              onClick={() =>
                form.setValues(
                  {
                    firstName: "test",
                    nested: { email: "test" },
                    "array[1].name": "test",
                  },
                  { keepPristine: true }
                )
              }
            >
              Test
            </Button>

            <Button
              onClick={() =>
                form.setErrors({
                  firstName: "test",
                  nested: { email: "test" },
                  "array[1].name": "test",
                })
              }
            >
              Errors
            </Button>
            <Button onClick={() => setRand(Math.random)}>Rand</Button>
            <Button onClick={() => form.reset()}>Reset</Button>
          </ButtonGroup>
          <DebugRender />
          <FormizStep name="one" label={`Step One ${rand}`}>
            <FieldInput
              name="firstName"
              label="First Name"
              defaultValue="default value"
              required="Required"
            />
          </FormizStep>
          <FormizStep name="two" label={`Step Two ${rand}`}>
            <FieldInput name="lastName" label="Last Name" required="Required" />
            <FieldInput name="nested.email" label="Email" required="Required" />
          </FormizStep>
          <FormizStep name="three" label={`Step Three`}>
            {keys.map((key, index) => (
              <FieldInput
                key={key}
                name={`array[${index}].name`}
                label={`Name ${index}`}
                defaultValue={String(index)}
                required="Required"
              />
            ))}
            <Button onClick={() => setKeys((s) => [...s, Math.random()])}>
              Add
            </Button>
            <Button
              onClick={() => setKeys(([f, ...s]) => [f, Math.random(), ...s])}
            >
              Add at 1
            </Button>
          </FormizStep>
          <Box>
            <Button type="submit">Submit</Button>
          </Box>
          <Code as="pre">{JSON.stringify(values, null, 2)}</Code>
          {form.steps?.map((step) => (
            <Button key={step.name} onClick={() => form.goToStep(step.name)}>
              {step.label}
            </Button>
          ))}
        </Stack>
      </Formiz>
    </Flex>
  );
};

export default Playground;
