import { Formiz, FieldProps, useForm, useFormFields, useField, useFormContext } from "@formiz/core";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Box, Button, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FieldInput } from "@/components/FieldInput";
import { FC, useEffect } from "react";

type SubFieldValues = {
  subFieldInput: string;
}
type FieldSubFormProps = FieldProps<SubFieldValues>;

const FieldSubForm: FC<FieldSubFormProps> = (props) => {
  const subForm = useForm();
  const isSubmitDisabled = !subForm.isValid && subForm.isSubmitted

  const { setValue } = useField(props);

  const handleSubmit = (value: SubFieldValues) => {
    setValue(value);
  }
  
  return (
    <Formiz connect={subForm} onValidSubmit={handleSubmit}>
      <Stack 
        border="1px dashed" 
        borderColor="gray.200"
        bgColor="gray.50"
        _dark={{
          bg: "gray.900",
          borderColor: "gray.700",
        }}
        p="5"
        borderRadius="md"
        justifyContent="flex-end"
      >
        <FieldInput
          label="Sub form label"
          name="subFieldInput"
          required="Input is required"
        />

        <Button 
          mt="2"
          onClick={() => subForm.submit()} 
          isDisabled={isSubmitDisabled}
        >
          Submit subForm
        </Button>
      </Stack>
    </Formiz>
  )
}

const NestedForms = () => {
  const form = useForm();

  const handleSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <Formiz connect={form} autoForm onValidSubmit={handleSubmit}>
      <PageLayout>
        <PageHeader githubPath="nested-forms.tsx">Nested Forms</PageHeader>
        
        <FieldInput
          label="Label"
          name="fieldInput"
          mb="2"
        />

        <FieldSubForm name="subFormField" formatValue={value => value?.subFieldInput} />

        <Flex mt="4">
          <Button
            type="submit"
            ml="auto"
            isDisabled={!form.isValid && form.isSubmitted}
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};

export default NestedForms;
