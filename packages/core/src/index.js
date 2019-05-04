import React from 'react';
import { FormContextProvider } from './FormContext';
import { Form, propTypes, defaultProps } from './Form';
import { useField } from './useField';

export const useFormiz = useField;

export const Formiz = props => (
  <FormContextProvider>
    <Form {...props} />
  </FormContextProvider>
);

Formiz.propTypes = propTypes;
Formiz.defaultProps = defaultProps;
