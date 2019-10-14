import React from 'react';
import uuidv4 from 'uuid/v4';
import { Formiz, useForm } from '@formiz/core';
import { Button, Flex, Stack, IconButton, Box } from '@chakra-ui/core';
import { FieldInput } from '../components/FieldInput';
import { PageHeader } from '../components/PageHeader';

const defaultCollection = [
  {
    id: uuidv4(),
    name: 'Default name'
  },
  {
    id: uuidv4(),
  }
];

export const Repeater = () => {
  const form = useForm();
  const [collection, setCollection] = React.useState(defaultCollection);

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
    console.log(values.collection.length)
    form.invalidateFields({
      name: 'You can display an error after an API call'
    })
  };

  const addItem = () => {
    setCollection(c => [
      ...c,
      {
        id: uuidv4(),
      }
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
        <PageHeader onReset={() => setCollection(defaultCollection)}>
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

        <Button
          onClick={addItem}
          role="group"
          w="full"
          h="auto"
          d="flex"
          justifyContent="start"
          p="4"
          backgroundColor="gray.50"
          border="1px dashed"
          borderColor="gray.200"
          rounded="md"
          transition="0.2s"
          _hover={{ borderColor: 'gray.400' }}
          _focus={{ outline: 'none', boxShadow: 'outline' }}
          _active={{ backgroundColor: 'gray.200' }}
        >
          <Button
            as="span"
            leftIcon="add"
            size="sm"
            variant="outline"
            _groupHover={{ backgroundColor: 'gray.100' }}
          >
            Add member
          </Button>
        </Button>

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
    </Formiz>
  );
};
