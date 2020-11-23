import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDarkTheme } from '../hooks/isDarkTheme';

const propTypes = {
  label: PropTypes.node,
};
const defaultProps = {
  label: 'Add',
};

export const AddPlaceholder = ({ label, ...props }) => {
  const isDarkTheme = useDarkTheme();

  return (
    <Button
      role="group"
      my="6"
      w="full"
      h="auto"
      d="flex"
      justifyContent="start"
      p="4"
      backgroundColor={isDarkTheme ? 'gray.900' : 'gray.50'}
      border="1px dashed"
      borderColor={isDarkTheme ? 'gray.700' : 'gray.200'}
      borderRadius="md"
      transition="0.2s"
      _hover={{ borderColor: isDarkTheme ? 'gray.600' : 'gray.400' }}
      _focus={{ outline: 'none', boxShadow: 'outline' }}
      _active={{ backgroundColor: isDarkTheme ? 'gray.800' : 'gray.200' }}
      {...props}
    >
      <Button
        as="span"
        leftIcon={<AddIcon />}
        size="sm"
        variant="outline"
        backgroundColor={isDarkTheme ? 'gray.700' : 'gray.100'}
        border="none"
        _groupHover={{ backgroundColor: isDarkTheme ? 'gray.600' : 'gray.200' }}
      >
        {label}
      </Button>
    </Button>
  );
};

AddPlaceholder.propTypes = propTypes;
AddPlaceholder.defaultProps = defaultProps;
