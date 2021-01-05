import React, { useEffect, useState } from 'react';
import { Textarea } from '@chakra-ui/react';
import { useField } from '@formiz/core';
import { FormGroup } from '../FormGroup';

export const FieldTextarea = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    resetKey,
    setValue,
    value,
    otherProps,
  } = useField(props);
  const { required, name } = props;
  const {
    children, label, placeholder, helper, ...rest
  } = otherProps;
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
    name,
    ...rest,
  };

  return (
    <FormGroup {...formGroupProps}>
      <Textarea
        id={id}
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setIsTouched(true)}
        aria-invalid={showError}
        aria-describedby={!isValid ? `${id}-error` : undefined}
        placeholder={placeholder}
      />
      {children}
    </FormGroup>
  );
};
