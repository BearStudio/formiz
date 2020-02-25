import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid/v4';
import { Formiz, useForm } from '@formiz/core';
import {
  Button, Flex, Stack, IconButton, Box,
} from '@chakra-ui/core';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { AddPlaceholder } from '../components/AddPlaceholder';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';

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
  const toastValues = useToastValues();
  const [collection, setCollection] = useState(defaultCollection);

  useEffect(() => {
    setCollection(defaultCollection);
  }, [form.resetKey]);

  const handleSubmit = (values) => {
    toastValues(values);
  };

  const addItem = () => {
    setCollection((c) => [
      ...c,
      {
        id: uuidv4(),
      },
    ]);
  };

  const addItemAtIndex = (index) => {
    setCollection((c) => [
      ...c.slice(0, index + 1),
      {
        id: uuidv4(),
      },
      ...c.slice(index + 1),
    ]);
  };

  const removeItem = (id) => {
    setCollection((c) => c.filter((x) => x.id !== id));
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
    >
      <PageLayout>
        <form
          noValidate
          onSubmit={form.submit}
        >
          <PageHeader githubPath="Repeater.js">
            Repeater
          </PageHeader>

          <Box>
            {collection.map(({ id, name }, index) => (
              <Stack key={id} isInline spacing="4" mb="6">
                <Box transform="translateY(4rem)">
                  <IconButton
                    aria-label="Add"
                    icon="add"
                    size="sm"
                    onClick={() => addItemAtIndex(index)}
                    variant="ghost"
                    isDisabled={collection.length > 20}
                    pointerEvents={index + 1 >= collection.length ? 'none' : null}
                    opacity={index + 1 >= collection.length ? 0 : null}
                  />
                </Box>
                <Box flex="1">
                  <FieldInput
                    name={`collection[${index}].name`}
                    defaultValue={name}
                    label="Name"
                    required="Required"
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
                    aria-label="Delete"
                    icon="delete"
                    onClick={() => removeItem(id)}
                    variant="ghost"
                  />
                </Box>
              </Stack>
            ))}
          </Box>

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
      </PageLayout>
    </Formiz>
  );
};
