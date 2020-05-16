import React, { useState, useEffect } from 'react';
import { FormizStep, useForm } from '@formiz/core';
import {
  IconButton, Box, Stack,
} from '@chakra-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { FieldInput } from '../../components/Fields/FieldInput';
import { AddPlaceholder } from '../../components/AddPlaceholder';
import { useDarkTheme } from '../../hooks/isDarkTheme';

export const ExposedPorts = () => {
  const form = useForm({ stateLevel: 'fields' });
  const isDarkTheme = useDarkTheme();
  const [exposedPorts, setExposedPorts] = useState([]);

  useEffect(() => {
    setExposedPorts([]);
  }, [form.resetKey]);

  const addItem = () => {
    setExposedPorts((s) => [
      ...s,
      {
        id: uuidv4(),
      },
    ]);
  };

  const removeItem = (id) => {
    setExposedPorts((s) => s.filter((x) => x.id !== id));
  };

  return (
    <FormizStep name="exposedPorts">
      {exposedPorts.map((port, index) => (
        <Stack
          key={port.id}
          isInline
          spacing="4"
          mb="6"
          backgroundColor={isDarkTheme ? 'gray.700' : 'gray.50'}
          rounded="md"
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
                  rule: (val) => (form.values.ports || [])
                    .filter((x) => x.number === val).length <= 1,
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
              icon="delete"
              onClick={() => removeItem(port.id)}
              variant="ghost"
            />
          </Box>
        </Stack>
      ))}
      {exposedPorts.length <= 20 && (
        <AddPlaceholder label="Add port" onClick={addItem} />
      )}
    </FormizStep>
  );
};
