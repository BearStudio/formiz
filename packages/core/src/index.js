import React from 'react';

import {
  FormContextProvider,
  propTypes as propTypesForm,
  defaultProps as defaultPropsForm,
} from './FormContext';

import {
  FormStep,
  propTypes as propTypesFormStep,
  defaultProps as defaultPropsFormStep,
} from './FormStep';
import { FormStepContextProvider } from './FormStepContext';

export { useForm } from './useForm';
export { useField, fieldPropTypes, fieldDefaultProps } from './useField';

export const Formiz = FormContextProvider;
Formiz.propTypes = propTypesForm;
Formiz.defaultProps = defaultPropsForm;

export const FormizStep = ({ name, ...props }) => (
  <FormStepContextProvider name={name}>
    <FormStep {...props} name={name} />
  </FormStepContextProvider>
);

FormizStep.propTypes = propTypesFormStep;
FormizStep.defaultProps = defaultPropsFormStep;
