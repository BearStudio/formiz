import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import {
  Button, Flex, Stack, IconButton, Box, Wrap, WrapItem,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { AddPlaceholder } from '../components/AddPlaceholder';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';
import { useRepeater } from '../hooks/useRepeater';

const DEFAULT_VALUES = {
  collection: [{ name: 'Default name' }],
};

const INITIAL_VALUES = {
  members: [
    { company: 'Initial Company (1)' },
    { name: 'Initial Name (2)', company: 'Initial Company (2)' },
  ],
};

export const Repeater = () => {
  const form = useForm({ subscribe: 'form' });
  const toastValues = useToastValues();
  const collection = useRepeater({
    name: 'members',
    form,
    initialValues: INITIAL_VALUES.members,
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
            {collection.keys.map((key, index) => (
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
                    onClick={() => collection.insert(index + 1)}
                    variant="ghost"
                    isDisabled={collection.length > 20}
                    pointerEvents={
                      index + 1 >= collection.length ? 'none' : undefined
                    }
                    opacity={index + 1 >= collection.length ? 0 : undefined}
                  />
                </Box>
                <Box flex="1">
                  <FieldInput
                    name={`members[${index}].name`}
                    defaultValue={DEFAULT_VALUES.collection[index]?.name}
                    label="Name"
                    required="Required"
                    m="0"
                  />
                </Box>
                <Box flex="1">
                  <FieldInput
                    name={`members[${index}].company`}
                    label="Company"
                    m="0"
                  />
                </Box>
                <Box pt="1.75rem">
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => collection.remove(index)}
                    variant="ghost"
                  />
                </Box>
              </Stack>
            ))}
          </Box>

          {collection.length <= 20 && (
            <AddPlaceholder
              label="Add member"
              onClick={() => collection.append()}
            />
          )}

          <Wrap>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.insert(4, { name: 'Name (5)' });
                }}
              >
                Add 1 member at index 4
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.insert(-2, { name: `Name (${Math.max(0, collection.length - 2)})` });
                }}
              >
                Add 1 member at index -2
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.insertMultiple(1, [{ name: 'Name (2)' }, { name: 'Name (3)' }, { name: 'Name (4)' }]);
                }}
              >
                Add 3 members at index 1
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.remove(1);
                }}
              >
                Remove member at index 1
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.remove(-2);
                }}
              >
                Remove member at index -2
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.removeMultiple([1, 3, 4]);
                }}
              >
                Remove members at index 1, 3 & 4
              </Button>
            </WrapItem>
            <WrapItem>
              <Button
                size="sm"
                onClick={() => {
                  collection.set([{ name: 'Name (1)' }, { name: 'Name (2)' }, { name: 'Name (3)' }]);
                }}
              >
                Set collection to 3 members
              </Button>
            </WrapItem>
          </Wrap>

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
