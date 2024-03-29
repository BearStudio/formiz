import { Formiz, FieldProps, useForm, useField } from "@formiz/core";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import {
  Icon,
  Button,
  ButtonGroup,
  Flex,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { FieldInput } from "@/components/FieldInput";
import { FormGroup } from "@/components/FormGroup";
import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";

type FieldSubFormProps = FieldProps<string> & {
  label: string;
};

type SubFormValues = any;

const FieldSubForm: FC<FieldSubFormProps> = (props) => {
  const { label } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setValue, value, errorMessage, isValid } = useField(props);

  const subForm = useForm<SubFormValues>({
    onValidSubmit: ({ firstName, lastName }) => {
      setValue([firstName, lastName].join(" "));
      onClose();
    },
  });

  const isSubmitDisabled = !subForm.isValid && subForm.isSubmitted;

  return (
    <Formiz connect={subForm}>
      <FormGroup label={label} errorMessage={errorMessage} showError={!isValid}>
        <Popover
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          placement="right"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button
              minW="28"
              variant="link"
              textDecoration="underline"
              size="sm"
              rightIcon={<Icon as={FiChevronDown} />}
            >
              {value ?? "No name"}
            </Button>
          </PopoverTrigger>
          <PopoverContent p={5}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Stack spacing={4}>
              <FieldInput
                label="First name"
                name="firstName"
                required="First name is required"
              />

              <FieldInput
                label="Last name"
                name="lastName"
                required="Last name is required"
              />

              <ButtonGroup display="flex" justifyContent="flex-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={isSubmitDisabled}
                  onClick={() => {
                    subForm.submit();
                  }}
                >
                  Save
                </Button>
              </ButtonGroup>
            </Stack>
          </PopoverContent>
        </Popover>
      </FormGroup>
    </Formiz>
  );
};

type FormValues = any;

const NestedForms = () => {
  const form = useForm<FormValues>({ onValidSubmit: console.log });

  return (
    <Formiz connect={form} autoForm>
      <PageLayout>
        <PageHeader githubPath="nested-forms.tsx">Nested Forms</PageHeader>

        <FieldSubForm
          label="Full name"
          name="fullName"
          required="Full name is required"
        />

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
