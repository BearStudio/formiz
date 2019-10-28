import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
} from '@chakra-ui/core';
import { useField } from '@formiz/core';
import { FormGroup } from '../FormGroup';

const propTypes = {
  label: PropTypes.node,
  type: PropTypes.string,
  isRequired: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  placeholder: PropTypes.string,
  helper: PropTypes.node,
};
const defaultProps = {
  label: '',
  type: 'text',
  isRequired: false,
  placeholder: '',
  helper: '',
};

export const FieldInput = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
  } = useField(props);
  const {
    label, type, isRequired, placeholder, helper, ...otherProps
  } = props;
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired,
    label,
    showError,
    ...otherProps,
  };

  return (
    <FormGroup {...formGroupProps}>
      <Input
        key={resetKey}
        type={type || 'text'}
        id={id}
        value={value || ''}
        onChange={e => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : null}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

FieldInput.propTypes = propTypes;
FieldInput.defaultProps = defaultProps;
