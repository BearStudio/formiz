import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Textarea,
} from '@chakra-ui/core';
import { useField, fieldPropTypes, fieldDefaultProps } from '@formiz/core';
import { FormGroup } from '../FormGroup';

const propTypes = {
  label: PropTypes.node,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  helper: PropTypes.node,
  ...fieldPropTypes,
};
const defaultProps = {
  label: '',
  type: 'text',
  placeholder: '',
  helper: '',
  ...fieldDefaultProps,
};

export const FieldTextarea = (props) => {
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
    label, required, placeholder, helper, ...otherProps
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
    isRequired: !!required,
    label,
    showError,
    ...otherProps,
  };

  return (
    <FormGroup {...formGroupProps}>
      <Textarea
        key={resetKey}
        id={id}
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : null}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

FieldTextarea.propTypes = propTypes;
FieldTextarea.defaultProps = defaultProps;
