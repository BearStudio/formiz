import React, { useEffect, useState } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useField } from '@formiz/core';
import { FormGroup } from '../FormGroup';

export const FieldSlider = (props) => {
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
    children, label, type, helper, min = 0, max = 100, step = 1, ...rest
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

  const changeValue = (val) => {
    const newVal = parseInt(val, 10);
    setValue(newVal);
  };

  return (
    <FormGroup {...formGroupProps}>
      <Stack direction="row" spacing="8" mt="1">
        <NumberInput
          size="sm"
          maxW="6rem"
          id={id}
          value={value || 0}
          onChange={changeValue}
          onBlur={() => setIsTouched(true)}
          aria-invalid={showError}
          aria-describedby={!isValid ? `${id}-error` : undefined}
          min={min}
          max={max}
          step={step}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Slider
          id={`${id}-slider`}
          value={value || 0}
          onChange={changeValue}
          onBlur={() => setIsTouched(true)}
          aria-invalid={showError}
          aria-describedby={!isValid ? `${id}-error` : undefined}
          min={min}
          max={max}
          step={step}
          colorScheme="brand"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb backgroundColor="brand.500" />
        </Slider>
      </Stack>
      {children}
    </FormGroup>
  );
};
