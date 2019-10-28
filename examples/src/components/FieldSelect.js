import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
} from '@chakra-ui/core';
import { useField } from '@formiz/core';

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
    label, options, isRequired, placeholder, helper, ...rest
  } = props;
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  return (
    <FormControl mb="6" isInvalid={showError} isRequired={!!isRequired} {...rest}>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      {!!helper && (
        <FormHelperText mt="0" mb="3">
          {helper}
        </FormHelperText>
      )}
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
      <FormErrorMessage id={`${id}-error`}>
        { errorMessage }
      </FormErrorMessage>
    </FormControl>
  );
};
