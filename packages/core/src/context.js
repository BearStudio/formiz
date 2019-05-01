import React, { useContext, useEffect } from 'react';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from './errors';

export const FormContext = React.createContext();

export const initialState = {
  fields: [],
};

export const reducer = (state, action) => {
  const { name, value } = action.payload || {};

  switch (action.type) {
  case 'field.register':
    return {
      ...state,
      fields: [
        ...state.fields.filter(field => field.name !== name),
        {
          ...state.fields.find(field => field.name === name) || {},
          name,
          value: value || null,
          isEnabled: true,
        },
      ],
    };

  case 'field.unregister':
    return {
      ...state,
      fields: [
        ...state.fields.filter(field => field.name !== name),
        {
          ...state.fields.find(field => field.name === name) || {},
          isEnabled: false,
        },
      ],
    };

  case 'field.setValue':
    return {
      ...state,
      fields: [
        ...state.fields.filter(field => field.name !== name),
        {
          ...state.fields.find(field => field.name === name),
          value,
        },
      ],
    };

  case 'form.reset':
    return initialState;

  default:
    return state;
  }
};

export const useFormContext = () => useContext(FormContext);

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
    dispatch({
      type: 'field.register',
      payload: { name, value: defaultValue },
    });

    return () => {
      dispatch({
        type: 'field.unregister',
        payload: { name },
      });
    };
  }, [name]);

  const field = state.fields.find(f => f.name === name);

  return {
    value: field ? field.value : null,
    setValue: value => dispatch({
      type: 'field.setValue',
      payload: { name, value },
    }),
  };
};
