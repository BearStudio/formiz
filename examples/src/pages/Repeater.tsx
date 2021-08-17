import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import {
  Button, Flex, Stack, IconButton, Box,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { AddPlaceholder } from '../components/AddPlaceholder';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';
import { useRepeater } from '../hooks/useRepeater';

const DEFAULT_VALUES = {
  collection: [
    { name: 'Default name' },
  ],
};

const INITIAL_VALUES = {
  collection: [
    { company: 'Initial Company (1)' },
    { name: 'Initial Name (2)', company: 'Initial Company (2)' },
  ],
};

export const Repeater = () => {
  const form = useForm({ subscribe: 'form' });
  const toastValues = useToastValues();
  const {
    keys, add: addItem, remove: removeItem,
  } = useRepeater({
    name: 'collection',
    form,
    initialValues: INITIAL_VALUES.collection,
  });

  const handleSubmit = (values) => {
    toastValues(values);
  };

  return (
    <Formiz
      key={form.resetKey}
      connect={form}
      onValidSubmit={handleSubmit}
      initialValues={INITIAL_VALUES}
    >
      <PageLayout>
        <form noValidate onSubmit={form.submit}>
          <PageHeader githubPath="Repeater.tsx">Repeater</PageHeader>

          <Box>
            {keys.map((key, index) => (
              <Stack
                key={key}
                direction="row"
                spacing="4"
                mb="6"
                data-test={`repeater-item[${index}]`}
              >
                <Box transform="translateY(4rem)">
                  <IconButton
                    aria-label="Add"
                    icon={<AddIcon />}
                    size="sm"
                    onClick={() => addItem({ index: index + 1 })}
                    variant="ghost"
                    isDisabled={keys.length > 20}
                    pointerEvents={
                      index + 1 >= keys.length ? 'none' : undefined
                    }
                    opacity={index + 1 >= keys.length ? 0 : undefined}
                  />
                </Box>
                <Box flex="1">
                  <FieldInput
                    name={`collection[${index}].name`}
                    defaultValue={DEFAULT_VALUES.collection[index]?.name}
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
                    icon={<DeleteIcon />}
                    onClick={() => removeItem(index)}
                    variant="ghost"
                  />
                </Box>
              </Stack>
            ))}
          </Box>

          {keys.length <= 20 && (
            <AddPlaceholder label="Add member" onClick={() => addItem()} />
          )}

          <Flex mt="4">
            <Button
              type="submit"
              ml="auto"
              colorScheme="brand"
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
