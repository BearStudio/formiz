import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from '@chakra-ui/core';
import { WarningIcon } from '@chakra-ui/icons';

const propTypes = {
  children: PropTypes.node,
  errorMessage: PropTypes.node,
  helper: PropTypes.node,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.node,
  showError: PropTypes.bool,
};
const defaultProps = {
  children: '',
  errorMessage: '',
  helper: '',
  isRequired: false,
  label: '',
  showError: false,
};

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
    {!!label && (
      <FormLabel htmlFor={id}>
        {label}
      </FormLabel>
    )}
    {!!helper && (
      <Text color="gray.500" fontSize="sm" mt="0" mb="3">
        {helper}
      </Text>
    )}
    {children}
    <FormErrorMessage id={`${id}-error`}>
      <WarningIcon mr="2" />
      { errorMessage }
    </FormErrorMessage>
  </FormControl>
);

FormGroup.propTypes = propTypes;
FormGroup.defaultProps = defaultProps;
