import { useEffect } from 'react';
import { useFormContext } from '../FormContext';
import {
  fieldRegister, fieldUnregister, fieldSetValue, fieldValidate,
} from '../FormContext/actions';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const useField = ({ name, defaultValue }) => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;

  useEffect(() => {
    dispatch(fieldRegister(name, defaultValue));

    return () => {
      dispatch(fieldUnregister(name));
    };
  }, [name]);

  useEffect(() => {
    dispatch(fieldValidate(name));
  }, [name, defaultValue]);

  const field = state.fields.find(f => f.name === name);
  const errorMessages = field ? (field.errors || []).filter(x => !!x) : [];

  return {
    value: field ? field.value : null,
    errorMessages,
    errorMessage: errorMessages[0],
    isValid: field ? !field.errors.length : true,
    isInvalid: field ? field.errors.length > 0 : false,
    setValue: (value) => {
      dispatch(fieldSetValue(name, value));
      dispatch(fieldValidate(name));
    },
  };
};
