import React from "react";

import { deepMemo, FieldProps, useField } from "@formiz/core";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";
import {
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

type Value = number;

export type FieldSliderProps<FormattedValue> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps & {
    min?: number;
    max?: number;
    step?: number;
  };

const FieldSliderBase = <FormattedValue = Value,>(
  props: FieldSliderProps<FormattedValue>
) => {
  const {
    errorMessage,
    id,
    isValid,
    isRequired,
    setValue,
    value,
    setIsTouched,
    resetKey,
    shouldDisplayError,
    otherProps: {
      children,
      label,
      helper,
      min = 0,
      max = 100,
      step = 1,
      ...rest
    },
  } = useField(props);

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired,
    label,
    showError: shouldDisplayError,
    ...rest,
  };

  return (
    <FormGroup {...formGroupProps}>
      <Stack direction="row" spacing="8" mt="1">
        <NumberInput
          size="sm"
          maxW="6rem"
          id={id}
          value={value ?? 0}
          onChange={(_, val) => setValue(isNaN(val) ? 0 : val)}
          onFocus={() => setIsTouched(false)}
          onBlur={() => setIsTouched(true)}
          aria-invalid={shouldDisplayError}
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
          key={resetKey}
          focusThumbOnChange={false}
          id={`${id}-slider`}
          value={value ?? 0}
          onChange={(val) => setValue(val)}
          aria-invalid={shouldDisplayError}
          aria-describedby={!isValid ? `${id}-error` : undefined}
          min={min}
          max={max}
          step={step}
          colorScheme="blue"
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb backgroundColor="blue.500" />
        </Slider>
      </Stack>
      {children}
    </FormGroup>
  );
};

export const FieldSlider = deepMemo(FieldSliderBase);
