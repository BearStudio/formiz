import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

export const FormGroup = ({
  children,
  errorMessage,
  helper,
  id,
  isRequired,
  label,
  showError,
  ...props
}) => (
  <FormControl mb="6" isInvalid={showError} isRequired={isRequired} {...props}>
    {!!label && <FormLabel htmlFor={id}>{label}</FormLabel>}
    {!!helper && (
      <Text color="gray.500" fontSize="sm" mt="0" mb="3">
        {helper}
      </Text>
    )}
    {children}
    <FormErrorMessage id={`${id}-error`}>
      <WarningIcon mr="2" />
      {errorMessage}
    </FormErrorMessage>
  </FormControl>
);
