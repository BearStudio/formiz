import React, {
  useContext, useEffect, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { getInitialState } from './initialState';
import { getUniqueId } from './helpers';

export const FormContext = React.createContext();

export const useFormContext = () => useContext(FormContext);

export const FormContextProvider = ({
  children,
  onStateChange,
  onSubmit,
  onValidSubmit,
  onInvalidSubmit,
}) => {
  const formId = useMemo(() => getUniqueId(), []);
  const [state, setState] = useState(getInitialState(formId));

  const dispatch = useCallback((action) => {
    setState(s => action(s));
  }, []);

  useEffect(() => {
    onStateChange(state);
  }, [state]);

  return (
    <FormContext.Provider
      value={{
        state,
        dispatch,
        onSubmit,
        onValidSubmit,
        onInvalidSubmit,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onStateChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidSubmit: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
};

FormContextProvider.defaultProps = {
  onStateChange: () => {},
  onSubmit: () => {},
  onValidSubmit: () => {},
  onInvalidSubmit: () => {},
};
