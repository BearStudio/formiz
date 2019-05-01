import React from 'react';
import { useField } from './context';
import { FormContextProvider } from './FormContextProvider';
import { Form, propTypes, defaultProps } from './Form';

export const useFormiz = useField;

export const Formiz = props => (
  <FormContextProvider>
    <Form {...props} />
  </FormContextProvider>
);

Formiz.propTypes = propTypes;
Formiz.defaultProps = defaultProps;
