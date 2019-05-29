import React from 'react';
import PropTypes from 'prop-types';

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

export const FormizStep = ({ name, ...props }) => (
  <FormStepContextProvider name={name}>
    <FormStep {...props} />
  </FormStepContextProvider>
);

FormizStep.propTypes = propTypesFormStep;
FormizStep.defaultProps = defaultPropsFormStep;
