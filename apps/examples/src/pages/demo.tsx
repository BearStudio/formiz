import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Box, Button, Input, Stack, useDisclosure } from "@chakra-ui/react";
import {
  deepMemo,
  FieldProps,
  Formiz,
  useField,
  useForm,
  useFormContext,
  useFormFields,
} from "@formiz/core";
import { log } from "console";

type FieldInputProps = FieldProps<string>;

const FieldInputBase = (props: FieldInputProps) => {
  const { value, setValue, formattedValue, errorMessage } = useField(props);
  return (
    <Box>
      <>
        {formattedValue}
        <Input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />
        {errorMessage}
      </>
    </Box>
  );
};

const FieldInput = deepMemo(FieldInputBase);

const Inner = () => {
  const form2 = useFormContext();

  console.log(form2);

  return <Formiz></Formiz>;
};

export default function DemoPage() {
  const { onToggle, isOpen } = useDisclosure();
  const form = useForm();
  const fields = useFormFields({
    connect: form,
    fields: ["obj.firstName"],
    selector: (field) => field.value,
  });

  return (
    <Formiz
      connect={form}
      onSubmit={(v) => console.log(v)}
      autoForm
      initialValues={{
        obj: {
          firstName: "Initial First Name",
        },
      }}
    >
      <PageLayout>
        <PageHeader githubPath="demo.tsx">Demo</PageHeader>
        <Inner />
        <Stack>
          <FieldInput
            name="obj.firstName"
            formatValue={(v) => v?.toUpperCase()}
            required="Required"
            validations={[
              {
                handler: (value) => value === "TOTO",
                message: "Error",
              },
            ]}
          />
          {isOpen && (
            <FieldInput
              name="obj.lastName"
              formatValue={(v) => v?.toUpperCase()}
            />
          )}
          <Button onClick={() => onToggle()}>Toggle</Button>
          <Button type="submit">Submit</Button>
        </Stack>
      </PageLayout>
    </Formiz>
  );
}
