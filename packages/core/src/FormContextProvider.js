import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { FormContext, reducer, initialState } from './context';

export const FormContextProvider = ({ children, onStateChange }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    onStateChange(state);
  });

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onStateChange: PropTypes.func,
};

FormContextProvider.defaultProps = {
  onStateChange: () => {},
};
