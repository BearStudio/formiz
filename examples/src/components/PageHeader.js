import React from 'react';
import PropTypes from 'prop-types';
import { Button, Heading } from '@chakra-ui/core';
import { useForm } from '@formiz/core';


const propTypes = {
  children: PropTypes.node,
  onReset: PropTypes.func,
};
const defaultProps = {
  children: '',
  onReset: () => {},
};


export const PageHeader = ({ children, onReset }) => {
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

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;
