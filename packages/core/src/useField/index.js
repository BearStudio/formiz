import { useEffect } from 'react';
import { useFormContext } from '../FormContext';
import { fieldRegister, fieldUnregister, fieldSetValue } from '../FormContext/actions';
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

  const field = state.fields.find(f => f.name === name);

  return {
    value: field ? field.value : null,
    setValue: value => dispatch(fieldSetValue(name, value)),
  };
};
