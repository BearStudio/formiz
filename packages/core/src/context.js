import React, { useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

export const FormContext = React.createContext();

const initialState = {
  fields: [],
};

const reducer = (state, action) => {
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

export const FormContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFormContext = () => useContext(FormContext);

export const useField = ({ name }) => {
  const { state, dispatch } = useFormContext();

  if (!name) {
    throw new Error('A Formiz field always needs a `name` attribute.');
  }

  useEffect(() => {
    dispatch({
      type: 'field.register',
      payload: { name },
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
