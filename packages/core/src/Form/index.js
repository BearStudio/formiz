import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { useFormState } from '../useFormState';

export const propTypes = {
  children: PropTypes.node,
  autoForm: PropTypes.bool,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onChange: PropTypes.func,
  connect: PropTypes.shape({
    __connect__: PropTypes.func,
  }),
};

export const defaultProps = {
  children: '',
  autoForm: false,
  onValid: () => {},
  onInvalid: () => {},
  onChange: () => {},
  connect: {
    __connect__: () => {},
  },
};

export const Form = ({
  children,
  autoForm,
  onValid,
  onInvalid,
  onChange,
  connect,
}) => {
  const { dispatch } = useFormContext();

  const exposedState = useFormState();

  onChange(exposedState.values);

  if (exposedState.isValid) {
    onValid();
  } else {
    onInvalid();
  }

  useEffect(() => {
    connect.__connect__(exposedState);
  }, [
    dispatch,
    JSON.stringify(connect.__connect__),
    JSON.stringify(exposedState),
  ]);

  if (!autoForm) {
    return children;
  }

  return (
    <form noValidate onSubmit={exposedState.submit}>
      { children }
    </form>
  );
};

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
