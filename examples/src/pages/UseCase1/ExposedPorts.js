import React, { useState } from 'react';
import { FormizStep } from '@formiz/core';
import {
  IconButton, Box, Stack,
} from '@chakra-ui/core';
import uuidv4 from 'uuid/v4';
import { FieldInput } from '../../components/FieldInput';
import { AddPlaceholder } from '../../components/AddPlaceholder';

export const ExposedPorts = () => {
  const [exposedPorts, setExposedPorts] = useState([]);

  const addItem = () => {
    setExposedPorts(s => [
      ...s,
      {
        id: uuidv4(),
      },
    ]);
  };

  const removeItem = (id) => {
    setExposedPorts(s => s.filter(x => x.id !== id));
  };

  return (
    <FormizStep name="exposedPorts">
      {exposedPorts.map((port, index) => (
        <Stack
          key={port.id}
          isInline
          spacing="4"
          mb="6"
          backgroundColor="gray.50"
          rounded="md"
          borderWidth="1px"
          borderColor="gray.200"
          p="4"
        >
          <Box flex="1">
            <FieldInput
              name={`ports[${index}].number`}
              label="Port number"
              isRequired="Required"
              placeholder="e.g. 8080"
              m="0"
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
      <AddPlaceholder label="Add port" onClick={addItem} />
    </FormizStep>
  );
};
