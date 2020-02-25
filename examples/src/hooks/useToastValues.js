import React from 'react';
import { Box, useToast } from '@chakra-ui/core';

export const useToastValues = () => {
  const toast = useToast();

  return (values) => {
    toast({
      title: 'Values submitted',
      description: (
        <Box
          as="pre"
          maxHeight="80vh"
          maxWidth="80vw"
          overflow="auto"
        >
          {JSON.stringify(values, null, 2)}
        </Box>
      ),
      status: 'success',
      duration: null,
      isClosable: true,
      position: 'top',
    });
  };
};
