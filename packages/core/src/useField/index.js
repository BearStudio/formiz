import { useEffect, useRef } from 'react';
import dequal from 'dequal';
import { useFormContext } from '../Form/Context';
import {
  fieldRegister, fieldUnregister, fieldUpdateValidations, fieldSetValue,
} from '../Form/Context/actions';
import { useFormStepName } from '../FormStep/Context';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const useField = ({
  name,
  defaultValue,
  validations = [],
  keepValue,
}) => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();
  const step = useFormStepName();
  const prevValidations = useRef(null);

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;

  useEffect(() => {
    console.log('Render useField');
    prevValidations.current = validations;
  });

  useEffect(() => {
    dispatch(fieldRegister(name, { value: defaultValue, step, validations }));

    return () => {
      dispatch(fieldUnregister(name, keepValue));
    };
  }, [name, step]);

  useEffect(() => {
    dispatch(fieldUpdateValidations(name, validations));
  }, [
    name,
    !dequal(prevValidations.current, validations), // TODO: Optimize this :(
  ]);

  const field = state.fields.find(f => f.name === name);
  const errorMessages = field ? (field.errors || []).filter(x => !!x) : [];

  return {
    value: field ? field.value : null,
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field ? !field.errors.length : true,
    isPristine: field ? field.isPristine : true,
    setValue: (value) => {
      dispatch(fieldSetValue(name, value));
    },
  };
};
