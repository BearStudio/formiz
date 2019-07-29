import React, {
  useContext, useEffect, useState, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { initialState } from './actions';

export const FormContext = React.createContext();

export const useFormContext = () => useContext(FormContext);

export const FormContextProvider = ({ children, onStateChange }) => {
  const internalState = useRef(initialState);
  const debounce = useRef(null);
  const [state, setState] = useState(internalState.current);

  const dispatch = useCallback((action) => {
    internalState.current = action(internalState.current);

    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    debounce.current = setTimeout(() => {
      setState(internalState.current);
    });
  }, [internalState]);

  useEffect(() => {
    onStateChange(internalState.current);
  }, [internalState.current]);

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
