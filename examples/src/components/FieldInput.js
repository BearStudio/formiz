import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from "@chakra-ui/core";
import { useField } from '@formiz/core';

export const FieldInput = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
  } = useField(props)
  const { label, type, isRequired, ...rest } = props
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted)

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  return (
    <FormControl mb="6" isInvalid={showError} isRequired={!!isRequired} {...rest}>
      <FormLabel htmlFor={id} m="0">
        {label}
      </FormLabel>
      <Input
        key={resetKey}
        type={type || 'text'}
        id={id}
        value={value || ''}
        onChange={e => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : null}
      />
      <FormErrorMessage id={`${id}-error`}>
        { errorMessage }
      </FormErrorMessage>
    </FormControl>
  );
};
