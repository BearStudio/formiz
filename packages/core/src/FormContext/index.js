import React, {
  useContext, useEffect, useState, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { getInitialState } from './initialState';
import { getUniqueId } from './helpers';
import { getExposedState } from '../useForm/getExposedState';

export const propTypes = {
  autoForm: PropTypes.bool,
  children: PropTypes.node,
  connect: PropTypes.shape({
    __connect__: PropTypes.func,
  }),
  onChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onSubmit: PropTypes.func,
  onValidSubmit: PropTypes.func,
  onInvalidSubmit: PropTypes.func,
};

export const defaultProps = {
  autoForm: false,
  children: '',
  connect: {
    __connect__: () => {},
  },
  onChange: () => {},
  onStateChange: () => {},
  onValid: () => {},
  onInvalid: () => {},
  onSubmit: () => {},
  onValidSubmit: () => {},
  onInvalidSubmit: () => {},
};

export const FormContext = React.createContext();

export const useFormContext = () => useContext(FormContext);

export const FormContextProvider = ({
  autoForm,
  children,
  connect,
  onChange,
  onStateChange,
  onValid,
  onInvalid,
  onSubmit,
  onValidSubmit,
  onInvalidSubmit,
}) => {
  const formId = useMemo(() => getUniqueId('form'), []);
  const [state, setState] = useState(getInitialState(formId));

  const dispatch = useCallback((action) => {
    setState((s) => action(s));
  }, []);

  const exposedState = getExposedState({
    state,
    dispatch,
    onSubmit,
    onValidSubmit,
    onInvalidSubmit,
  });

  useEffect(() => {
    onStateChange(state);
  }, [state]);

  // Need better implementation
  onChange(exposedState.values);

  if (exposedState.isValid) {
    onValid();
  } else {
    onInvalid();
  }
  // ---- //

  useEffect(() => {
    connect.__connect__(exposedState);
  }, [
    dispatch,
    JSON.stringify(connect.__connect__),
    JSON.stringify(exposedState),
  ]);

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
      {!autoForm ? children : (
        <form noValidate onSubmit={exposedState.submit}>
          { children }
        </form>
      )}
    </FormContext.Provider>
  );
};

FormContextProvider.propTypes = propTypes;

FormContextProvider.defaultProps = defaultProps;
