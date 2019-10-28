import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/core';
import { useField } from '@formiz/core';

export const FieldTextarea = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    FormHelperText,
    value,
  } = useField(props);
  const {
    label, isRequired, placeholder, helper, ...rest
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
      <Textarea
        key={resetKey}
        id={id}
        value={value || ''}
        onChange={e => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : null}
        placeholder={placeholder}
      />
      <FormErrorMessage id={`${id}-error`}>
        { errorMessage }
      </FormErrorMessage>
    </FormControl>
  );
};
