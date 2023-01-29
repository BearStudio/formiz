import { FieldInput } from "@/components/FieldInput";
import { FieldSelect } from "@/components/FieldSelect";
import { FieldUpload } from "@/components/FieldUpload";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Button, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { Formiz, useForm, useFormFields } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import { NextPage } from "next";

const SimpleForm: NextPage = () => {
  const form = useForm();
  const { accountType, company } = useFormFields({
    connect: form,
    fields: ["accountType", "company"],
    selector: (f) => f.value,
  });

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
      initialValues={{ company: "My Company", info: "My company info" }}
      onValidSubmit={handleSubmit}
      autoForm
      onValuesChange={console.log}
      onValid={() => console.log("onValid")}
      onInvalid={() => console.log("onInvalid")}
    >
      <PageLayout>
        <PageHeader githubPath="index.tsx">Simple Form</PageHeader>
        <Stack spacing={4}>
          <FieldInput
            name="name"
            label="Name"
            required="Required"
            formatValue={(val) => (val || "").trim()}
          />

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

          <FieldSelect
            name="accountType"
            label="Account type"
            defaultValue="perso"
            options={[
              { label: "Personal", value: "perso" },
              { label: "Professional", value: "pro" },
            ]}
          >
            <Button
              size="sm"
              variant="link"
              onClick={() =>
                form.setValues({
                  accountType: "pro",
                  company: "BearStudio",
                })
              }
            >
              Set to `Professional` and company to `BearStudio`
            </Button>
          </FieldSelect>

          {accountType === "pro" && (
            <FieldInput
              name="company"
              label="Company"
              formatValue={(val) => (val || "").trim()}
            />
          )}

          {!!company && (
            <FieldInput
              name="info"
              label="Info"
              formatValue={(val) => (val || "").trim()}
            />
          )}

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

export default SimpleForm;
