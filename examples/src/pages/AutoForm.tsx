import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Flex } from '@chakra-ui/react';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { useToastValues } from '../hooks/useToastValues';
import { PageLayout } from '../layout/PageLayout';

export const AutoForm = () => {
  const form = useForm({ subscribe: 'form' });
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);

    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit} autoForm>
      <PageLayout>
        <PageHeader githubPath="AutoForm.tsx">Auto form</PageHeader>
        <FieldInput
          name="name"
          label="Name"
          required="Required"
          formatValue={(val) => (val || '').trim()}
        />
        <FieldInput
          name="email"
          label="Email"
          type="email"
          formatValue={(val) => (val || '').trim()}
          required="Required"
          validations={[
            {
              rule: isEmail(),
              message: 'Not a valid email',
            },
          ]}
          asyncValidations={[
            {
              rule: async (value) => new Promise((resolve) => setTimeout(() => {
                resolve((value || '').toLowerCase() === 'john@company.com');
              }, 1000)),
              message: 'Email already used. Try john@company.com',
            },
          ]}
        >
          <Button
            size="sm"
            variant="link"
            onClick={() => form.setFieldsValues({
              email: 'john@company.com',
            })}
          >
            Fill with john@company.com
          </Button>
        </FieldInput>
        <FieldInput
          name="company"
          label="Company"
          formatValue={(val) => (val || '').trim()}
        />
        <Flex>
          <Button
            type="submit"
            ml="auto"
            colorScheme="brand"
            isDisabled={
              (!form.isValid || form.isValidating) && form.isSubmitted
            }
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};
