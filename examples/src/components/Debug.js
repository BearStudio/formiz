import React from 'react';
import { useForm } from '@formiz/core';
import { Box } from '@chakra-ui/core';

const propTypes = {};
const defaultProps = {};

export const Debug = () => {
  const form = useForm();

  return (
    <Box
      data-test="debug"
      as="pre"
      fontSize="xs"
      flex="1"
    >
      <Box fontSize="sm" color="gray.400">
        # Debug useForm()
      </Box>
      {JSON.stringify(form, null, 2)}
    </Box>
  );
};

Debug.propTypes = propTypes;
Debug.defaultProps = defaultProps;
