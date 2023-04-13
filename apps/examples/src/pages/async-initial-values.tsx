import { FieldInput } from "@/components/FieldInput";
import { FieldSelect } from "@/components/FieldSelect";
import { FieldUpload } from "@/components/FieldUpload";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Button, Flex, Spinner, Stack } from "@chakra-ui/react";
import { Formiz, useForm } from "@formiz/core";
import { isEmail } from "@formiz/validations";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const SimpleForm: NextPage = () => {
  const toastValues = useToastValues();

  const handleSubmit = (values: any) => {
    toastValues(values);

    form.setErrors({
      name: "You can display an error after an API call",
    });
  };

  const [data, setData] = useState();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (await fetch("/api/async-initial-values")).json();
      setData(data);
      setIsFetched(true);
    };

    dataFetch();
  }, []);

  const form = useForm({
    ready: isFetched,
    initialValues: data,
    onValidSubmit: handleSubmit,
  });

  return (
    <Formiz connect={form} autoForm>
      <PageLayout>
        <PageHeader githubPath="index.tsx">Async Initial Values</PageHeader>
        {!isFetched && <Spinner />}
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
          />

          <Flex>
            <Button
              type="submit"
              ml="auto"
              isDisabled={
                !form.isReady ||
                ((!form.isValid || form.isValidating) && form.isSubmitted)
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
