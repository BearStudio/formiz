import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
} from '@chakra-ui/core';
import { useField } from '@formiz/core';
import { FormGroup } from '../FormGroup';

const propTypes = {
  label: PropTypes.node,
  isRequired: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  placeholder: PropTypes.string,
  helper: PropTypes.node,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
};
const defaultProps = {
  label: '',
  isRequired: false,
  placeholder: '',
  helper: '',
  options: [],
};

export const FieldSelect = (props) => {
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
    label, options, isRequired, placeholder, helper, ...otherProps
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
      <Select
        id={id}
        value={value || ''}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : null}
        placeholder={placeholder}
        selectProps={{
          key: resetKey,
          onChange: e => setValue(e.target.value),
        }}
      >
        {(options || []).map(item => (
          <option key={item.value} value={item.value}>
            {item.label || item.value}
          </option>
        ))}
      </Select>
    </FormGroup>
  );
};

FieldSelect.propTypes = propTypes;
FieldSelect.defaultProps = defaultProps;
