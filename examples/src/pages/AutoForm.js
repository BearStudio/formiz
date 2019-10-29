import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Button, Flex } from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';

export const AutoForm = () => {
  const form = useForm();

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
      autoForm
    >
      <PageLayout>
        <PageHeader>
          Auto form
        </PageHeader>
        <FieldInput
          name="name"
          label="Name"
          isRequired="Required"
        />
        <FieldInput
          name="email"
          label="Email"
          type="email"
          isRequired="Required"
          validations={[
            {
              rule: isEmail(),
              message: 'Not a valid email',
            },
          ]}
        />
        <FieldInput
          name="company"
          label="Company"
        />
        <Flex>
          <Button
            type="submit"
            ml="auto"
            variantColor="brand"
            isDisabled={!form.isValid && form.isSubmitted}
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};
