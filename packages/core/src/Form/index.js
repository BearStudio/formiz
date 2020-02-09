import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { getExposedState } from '../useForm/getExposedState';

export const propTypes = {
  children: PropTypes.node,
  autoForm: PropTypes.bool,
};

export const defaultProps = {
  children: '',
  autoForm: false,
};

export const Form = ({
  children,
  autoForm,
}) => {
  const formContext = useFormContext();
  const exposedState = getExposedState(formContext);

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
