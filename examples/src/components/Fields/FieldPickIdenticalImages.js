import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  SimpleGrid, Button, AspectRatioBox, Image,
} from '@chakra-ui/core';
import { useField, fieldPropTypes, fieldDefaultProps } from '@formiz/core';
import { FormGroup } from '../FormGroup';

const propTypes = {
  label: PropTypes.node,
  placeholder: PropTypes.string,
  helper: PropTypes.node,
  options: PropTypes.arrayOf(PropTypes.string),
  ...fieldPropTypes,
};
const defaultProps = {
  label: '',
  placeholder: '',
  helper: '',
  options: [],
  ...fieldDefaultProps,
};

export const FieldPickIdenticalImages = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    setValue,
    value,
    valueDebounced,
  } = useField(props);
  const {
    label, required, options, placeholder, helper, ...otherProps
  } = props;
  const { selectedImages: selectedImagesDebounced } = valueDebounced || { selectedImages: [] };
  const showError = !isValid && (selectedImagesDebounced.length >= 2 || isSubmitted);

  const { selectedImages } = value || { selectedImages: [] };

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired: !!required,
    label,
    showError,
    ...otherProps,
  };

  const displayItems = useMemo(() => [...options, ...options]
    .sort(() => Math.random() - 0.5),
  // eslint-disable-next-line
  [JSON.stringify(options)]);


  const changeValue = (itemValue, itemIndex) => {
    const nextValues = (selectedImages.find(x => x.index === itemIndex)
      ? selectedImages.filter(x => x.index !== itemIndex)
      : [
        (selectedImages[1] || selectedImages[0]),
        {
          value: itemValue,
          index: itemIndex,
        },
      ])
      .filter(x => !!x);

    const isIdentical = !!nextValues[0] && !!nextValues[1]
      && nextValues[0].value === nextValues[1].value;

    setValue(
      nextValues.length
        ? {
          isIdentical,
          value: isIdentical ? nextValues[0].value : null,
          selectedCount: nextValues.length,
          selectedImages: nextValues,
        }
        : null,
    );
  };

  return (
    <FormGroup {...formGroupProps}>
      <SimpleGrid columns={{ base: 3, sm: 6 }} spacing="4" mb="4">
        {displayItems.map((item, index) => (
          <AspectRatioBox
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ratio="1"
          >
            <Button
              onClick={() => changeValue(item, index)}
              shadow={selectedImages.find(x => x.index === index) ? '0 0 0 0.3rem' : null}
              _focus={{
                shadow: selectedImages.find(x => x.index === index) ? '0 0 0 0.3rem' : 'outline',
              }}
              color="brand.500"
              p={0}
              overflow="hidden"
              opacity={
                selectedImages.length >= 2
                && !selectedImages.find(x => x.index === index)
                  ? 0.6 : 1
              }
            >
              <Image
                ignoreFallback
                objectFit="cover"
                src={item}
                alt={`Image ${index}`}
              />
            </Button>
          </AspectRatioBox>
        ))}
      </SimpleGrid>
    </FormGroup>
  );
};

FieldPickIdenticalImages.propTypes = propTypes;
FieldPickIdenticalImages.defaultProps = defaultProps;
