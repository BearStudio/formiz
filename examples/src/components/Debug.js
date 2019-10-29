import React from 'react';
import { useForm } from '@formiz/core';
import { Box } from '@chakra-ui/core';

const propTypes = {};
const defaultProps = {};

export const Debug = () => {
  const form = useForm();

  return (
    <Box
      as="pre"
      backgroundColor="gray.800"
      color="gray.100"
      fontSize="xs"
      flex="1"
    >
      <Box fontSize="sm" color="gray.400">
        # Debug - Form values
      </Box>
      {JSON.stringify(form.values, null, 2)}
    </Box>
  );
};

Debug.propTypes = propTypes;
Debug.defaultProps = defaultProps;
