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

  const addItemAtIndex = (index) => {
    setCollection(c => [
      ...c.slice(0, index + 1),
      {
        id: uuidv4(),
      },
      ...c.slice(index + 1)
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
      <PageLayout>
        <form
          noValidate
          onSubmit={form.submit}
        >
          <PageHeader>
            Repeater
          </PageHeader>

          <Box>
            {collection.map(({ id, name }, index) => (
              <React.Fragment key={id}>
                <Stack isInline spacing="4" mb="6">
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
                <Button
                  onClick={() => addItemAtIndex(index)}
                  leftIcon="add"
                  size="sm"
                  variant="outline"
                  _last={{ d: 'none' }}
                  _hover={{ backgroundColor: 'gray.100' }}
                  mb="4"
                >
                  Add member
                </Button>
              </React.Fragment>
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
