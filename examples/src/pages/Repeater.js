import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid/v4';
import { Formiz, useForm } from '@formiz/core';
import {
  Button, Flex, Stack, IconButton, Box,
} from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { AddPlaceholder } from '../components/AddPlaceholder';
import { Debug } from '../components/Debug';

const defaultCollection = [
  {
    id: uuidv4(),
    name: 'Default name',
  },
  {
    id: uuidv4(),
  },
];

export const Repeater = () => {
  const form = useForm();
  const [collection, setCollection] = useState(defaultCollection);

  useEffect(() => {
    setCollection(defaultCollection);
  }, [form.resetKey]);

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
  };

  const addItem = () => {
    setCollection(c => [
      ...c,
      {
        id: uuidv4(),
      },
    ]);
  };

  const removeItem = (id) => {
    setCollection(c => c.filter(x => x.id !== id));
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
    >
      <form
        noValidate
        onSubmit={form.submit}
      >
        <PageHeader>
          Repeater
        </PageHeader>

        {collection.map(({ id, name }, index) => (
          <Stack key={id} isInline spacing="4" mb="6">
            <Box flex="1">
              <FieldInput
                name={`collection[${index}].name`}
                defaultValue={name}
                label="Name"
                isRequired="Required"
                m="0"
              />
            </Box>
            <Box flex="1">
              <FieldInput
                name={`collection[${index}].company`}
                label="Company"
                m="0"
              />
            </Box>
            <Box pt="1.75rem">
              <IconButton
                icon="delete"
                onClick={() => removeItem(id)}
                variant="ghost"
              />
            </Box>
          </Stack>
        ))}

        {collection.length <= 20 && (
          <AddPlaceholder label="Add member" onClick={addItem} />
        )}

        <Flex mt="4">
          <Button
            type="submit"
            ml="auto"
            variantColor="brand"
            isDisabled={!form.isValid && form.isSubmitted}
          >
            Submit
          </Button>
        </Flex>
      </form>
      <Debug />
    </Formiz>
  );
};
