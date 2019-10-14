import React from 'react';
import { Button, Heading } from '@chakra-ui/core';
import { useForm } from '@formiz/core';

export const PageHeader = ({ children, onReset = () => {} }) => {
  const form = useForm();

  return (
    <Heading mb="6" d="flex" alignItems="center">
      {children}
      <Button
        onClick={() => {
          form.reset();
          onReset();
        }}
        ml="auto"
        size="sm"
      >
        Reset form
      </Button>
    </Heading>
  );
};
