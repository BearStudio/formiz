import {
  FormContextProvider,
  propTypes as propTypesForm,
  defaultProps as defaultPropsForm,
} from './FormContext';

import {
  FormStepContextProvider,
  propTypes as propTypesFormStep,
  defaultProps as defaultPropsFormStep,
} from './FormStepContext';

export { useForm } from './useForm';
export { useField, fieldPropTypes, fieldDefaultProps } from './useField';

export const Formiz = FormContextProvider;
Formiz.propTypes = propTypesForm;
Formiz.defaultProps = defaultPropsForm;

export const FormizStep = FormStepContextProvider;

FormizStep.propTypes = propTypesFormStep;
FormizStep.defaultProps = defaultPropsFormStep;
