import React, { useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { actions, initialState } from './actions';

export const FormContext = React.createContext();

export const useFormContext = () => useContext(FormContext);

export const FormContextProvider = ({ children, onStateChange }) => {
  const [state, dispatch] = useReducer((_state, _action) => _action(_state), initialState);

  useEffect(() => {
    onStateChange(state);
  });

  return (
    <FormContext.Provider value={{ state, actions, dispatch }}>
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
