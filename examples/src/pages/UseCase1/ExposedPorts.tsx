import React from 'react';
import { FormizStep, useForm } from '@formiz/core';
import { IconButton, Box, Stack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FieldInput } from '../../components/Fields/FieldInput';
import { AddPlaceholder } from '../../components/AddPlaceholder';
import { useDarkTheme } from '../../hooks/isDarkTheme';
import { useRepeater } from '../../hooks/useRepeater';

export const ExposedPorts = () => {
  const form = useForm();
  const isDarkTheme = useDarkTheme();
  const exposedPorts = useRepeater({
    name: 'ports',
    form,
    initialValues: [],
  });

  return (
    <FormizStep name="exposedPorts">
      {exposedPorts.keys.map((key, index) => (
        <Stack
          key={key}
          direction="row"
          spacing="4"
          mb="6"
          backgroundColor={isDarkTheme ? 'gray.700' : 'gray.50'}
          borderRadius="md"
          borderWidth="1px"
          borderColor={isDarkTheme ? 'gray.900' : 'gray.200'}
          p="4"
        >
          <Box flex="1">
            <FieldInput
              name={`ports[${index}].number`}
              label="Port number"
              required="Required"
              placeholder="e.g. 8080"
              type="number"
              m="0"
              validations={[
                {
                  rule: (val) => (form.values.ports || []).filter((x) => x.number === val)
                    .length <= 1,
                  deps: [JSON.stringify(form.values.ports)],
                  message: 'Must be unique',
                },
              ]}
            />
          </Box>
          <Box flex="1">
            <FieldInput
              name={`ports[${index}].name`}
              label="Port name"
              placeholder="e.g. webapp"
              m="0"
            />
          </Box>
          <Box pt="1.75rem">
            <IconButton
              aria-label="Delete port"
              icon={<DeleteIcon />}
              onClick={() => exposedPorts.remove(index)}
              variant="ghost"
            />
          </Box>
        </Stack>
      ))}
      {exposedPorts.length <= 20 && (
        <AddPlaceholder label="Add port" onClick={() => exposedPorts.append()} />
      )}
    </FormizStep>
  );
};
