import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
  NumberInput,
} from '@chakra-ui/core';
import { useField, fieldPropTypes, fieldDefaultProps } from '@formiz/core';
import { FormGroup } from '../FormGroup';

const propTypes = {
  label: PropTypes.node,
  helper: PropTypes.node,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  ...fieldPropTypes,
};
const defaultProps = {
  label: '',
  helper: '',
  min: 0,
  max: 100,
  step: 1,
  ...fieldDefaultProps,
};

export const FieldSlider = (props) => {
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
    label,
    type,
    required,
    helper,
    min,
    max,
    step,
    ...otherProps
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

  const changeValue = (val) => {
    const newVal = parseInt(val, 10);
    setValue(newVal);
  };

  return (
    <FormGroup {...formGroupProps}>
      <Stack isInline spacing="8" mt="1">
        <NumberInput
          size="sm"
          maxW="6rem"
          id={id}
          value={value || 0}
          onChange={changeValue}
          onBlur={() => setIsTouched(true)}
          aria-invalid={showError}
          aria-describedby={!isValid ? `${id}-error` : null}
          min={min}
          max={max}
          step={step}
        />
        <Slider
          id={`${id}-slider`}
          value={value || 0}
          onChange={changeValue}
          onBlur={() => setIsTouched(true)}
          aria-invalid={showError}
          aria-describedby={!isValid ? `${id}-error` : null}
          min={min}
          max={max}
          step={step}
          color="brand"
        >
          <SliderTrack />
          <SliderFilledTrack />
          <SliderThumb backgroundColor="brand.500" />
        </Slider>
      </Stack>
    </FormGroup>
  );
};

FieldSlider.propTypes = propTypes;
FieldSlider.defaultProps = defaultProps;
