import React, { useContext } from 'react';
import PropTypes from 'prop-types';

export const FormStepContext = React.createContext();

export const useFormStepName = () => useContext(FormStepContext);

export const FormStepContextProvider = ({ children, name }) => (
  <FormStepContext.Provider value={name}>
    {children}
  </FormStepContext.Provider>
);

FormStepContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string,
};

FormStepContextProvider.defaultProps = {
  name: null,
};
