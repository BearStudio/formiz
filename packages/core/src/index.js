import React from 'react';

import {
  Form,
  propTypes as propTypesForm,
  defaultProps as defaultPropsForm,
} from './Form';
import { FormContextProvider } from './Form/Context';

import {
  FormStep,
  propTypes as propTypesFormStep,
  defaultProps as defaultPropsFormStep,
} from './FormStep';
import { FormStepContextProvider } from './FormStep/Context';

import { useField } from './useField';

export const useFormiz = useField;

export const Formiz = props => (
  <FormContextProvider>
    <Form {...props} />
  </FormContextProvider>
);

Formiz.propTypes = propTypesForm;
Formiz.defaultProps = defaultPropsForm;

export const FormizStep = ({ name, order, ...props }) => (
  <FormStepContextProvider name={name}>
    <FormStep {...props} name={name} order={order} />
  </FormStepContextProvider>
);

FormizStep.propTypes = propTypesFormStep;
FormizStep.defaultProps = defaultPropsFormStep;
