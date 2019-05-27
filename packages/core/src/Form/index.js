import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { getFormValues } from '../FormContext/helpers';

export const propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  onChange: PropTypes.func,
};

export const defaultProps = {
  children: '',
  onSubmit: () => {},
  onValid: () => {},
  onInvalid: () => {},
  onChange: () => {},
};

export const Form = ({
  children,
  onSubmit,
  onValid,
  onInvalid,
  onChange,
}) => {
  const { state } = useFormContext();

  onChange(getFormValues(state.fields));

  if (state.isFormValid) {
    onValid();
  } else {
    onInvalid();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(getFormValues(state.fields));
  };

  return (
    <form onSubmit={handleSubmit}>
      { children }
    </form>
  );
};


Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
