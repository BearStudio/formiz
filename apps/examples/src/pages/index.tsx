import { FieldInput } from "@/components/FieldInput";
import { FieldUpload } from "@/components/FieldUpload";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Button, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { Formiz, useForm } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import { NextPage } from "next";

const AutoForm: NextPage = () => {
  const form = useForm();
  const { onToggle, isOpen } = useDisclosure();

  const toastValues = useToastValues();

  const handleSubmit = (values: any) => {
    toastValues(values);

    form.setErrors({
      name: "You can display an error after an API call",
    });
  };

  return (
    <Formiz
      connect={form}
      initialValues={{ company: "My Company", name: "Initial name" }}
      onValidSubmit={handleSubmit}
      autoForm
      onValuesChange={console.log}
      onValid={() => console.log("onValid")}
      onInvalid={() => console.log("onInvalid")}
    >
      <PageLayout>
        <PageHeader githubPath="index.tsx">Auto form</PageHeader>
        <Stack spacing={4}>
          {isOpen && (
            <FieldInput
              name="name"
              label="Name"
              required="Required"
              formatValue={(val) => (val || "").trim()}
            />
          )}

          <Button onClick={onToggle}>Toggle</Button>
          <Button onClick={() => form.setValues({ name: "External" })}>
            setValues
          </Button>

          <FieldInput
            name="email"
            label="Email"
            type="email"
            formatValue={(val) => (val || "").trim()}
            required="Required"
            validations={[
              {
                handler: isEmail(),
                message: "Not a valid email",
              },
            ]}
            validationsAsync={[
              {
                handler: async (value: string) =>
                  new Promise((resolve) =>
                    setTimeout(() => {
                      resolve(
                        (value || "").toLowerCase() === "john@company.com"
                      );
                    }, 1000)
                  ),
                message: "Email already used. Try john@company.com",
              },
            ]}
          >
            <Button
              size="sm"
              variant="link"
              onClick={() =>
                form.setValues({
                  email: "john@company.com",
                })
              }
            >
              Fill with john@company.com
            </Button>
          </FieldInput>

          <FieldInput
            name="company"
            label="Company"
            formatValue={(val) => (val || "").trim()}
          />
          <FieldUpload
            name="file"
            label="File"
            required="Required"
            validations={[
              {
                handler: (v: { name: string }) => !v.name.startsWith("A"),
                message: "File name cannot start with 'A'",
              },
            ]}
          />
          <Flex>
            <Button
              type="submit"
              ml="auto"
              isDisabled={
                (!form.isValid || form.isValidating) && form.isSubmitted
              }
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </PageLayout>
    </Formiz>
  );
};

export default AutoForm;
