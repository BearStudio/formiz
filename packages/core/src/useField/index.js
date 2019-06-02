import { useEffect } from 'react';
import { useFormContext } from '../Form/Context';
import {
  fieldRegister, fieldUnregister, fieldSetValue,
} from '../Form/Context/actions';
import { useFormStepName } from '../FormStep/Context';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const useField = ({
  name,
  defaultValue,
  validations,
  keepValue,
}) => {
  if (!name) {
    throw ErrorFieldWithoutName;
  }

  const formContext = useFormContext();
  const step = useFormStepName();

  if (!formContext) {
    throw ErrorFieldWithoutForm;
  }

  const { state, dispatch } = formContext;

  useEffect(() => {
    dispatch(fieldRegister(name, { value: defaultValue, step, validations }));

    return () => {
      dispatch(fieldUnregister(name, keepValue));
    };
  }, [name]);

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
    },
  };
};
