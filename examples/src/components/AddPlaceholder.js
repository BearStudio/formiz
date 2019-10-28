import React from 'react';
import { Button } from '@chakra-ui/core';

const propTypes = {};
const defaultProps = {};

export const AddPlaceholder = ({ label = 'Add', ...props }) => (
  <Button
    role="group"
    my="6"
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
    {...props}
  >
    <Button
      as="span"
      leftIcon="add"
      size="sm"
      variant="outline"
      _groupHover={{ backgroundColor: 'gray.100' }}
    >
      {label}
    </Button>
  </Button>
);

AddPlaceholder.propTypes = propTypes;
AddPlaceholder.defaultProps = defaultProps;
