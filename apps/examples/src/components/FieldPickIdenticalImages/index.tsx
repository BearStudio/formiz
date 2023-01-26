import React, { useEffect, useRef, useState } from "react";

import { deepMemo, FieldProps, useField } from "@formiz/core";
import {
  AspectRatio,
  Button,
  SimpleGrid,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

type Value = {
  isIdentical: boolean;
  value: string | null;
  selectedCount: number;
  selectedImages: { value: string; index: number }[];
};

export type FieldPickIdenticalImagesProps = FieldProps<Value> &
  FormGroupProps & {
    options: string[];
  };

const FieldPickIdenticalImagesBase = (props: FieldPickIdenticalImagesProps) => {
  const {
    errorMessage,
    id,
    isRequired,
    setValue,
    value,
    isValid,
    isReady,
    setIsTouched,
    shouldDisplayError,
    otherProps: { children, label, helper, options, ...rest },
  } = useField(props, {
    formatValue: (v) => v?.value ?? null,
    required: "You need to select 2 images",
    validations: [
      {
        handler: (_, rawValue) => rawValue?.selectedCount === 2,
        message: "You need to select a second image",
      },
      {
        handler: (_, rawValue) => !!rawValue?.isIdentical,
        message: "Image are not identical",
      },
    ],
  });

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired,
    label,
    showError: shouldDisplayError,
    ...rest,
  };

  const selectedImages = value?.selectedImages ?? [];

  const [displayItems, setDisplayItems] = useState<string[]>(() => []);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  useEffect(() => {
    setDisplayItems(
      [...optionsRef.current, ...optionsRef.current].sort(
        () => Math.random() - 0.5
      )
    );
  }, []);

  const handleChange = (itemValue: string, itemIndex: number) => {
    const nextValues = (
      selectedImages.find((x) => x.index === itemIndex)
        ? selectedImages.filter((x) => x.index !== itemIndex)
        : [
            selectedImages[1] || selectedImages[0],
            {
              value: itemValue,
              index: itemIndex,
            },
          ]
    ).filter((x) => !!x);

    const isIdentical =
      !!nextValues[0] &&
      !!nextValues[1] &&
      nextValues[0].value === nextValues[1].value;

    if (!nextValues.length) {
      setValue(null);
      return;
    }

    if (nextValues.length > 1) {
      setIsTouched(true);
    }

    setValue({
      isIdentical,
      value: isIdentical ? nextValues[0].value : null,
      selectedCount: nextValues.length,
      selectedImages: nextValues,
    });
  };

  return (
    <FormGroup {...formGroupProps}>
      <SimpleGrid columns={{ base: 3, sm: 6 }} spacing="4" mb="4">
        {displayItems.map((item, index) => (
          <AspectRatio key={item + index} ratio={1}>
            <Button
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              onClick={() => handleChange(item, index)}
              boxShadow={
                selectedImages.find((x) => x.index === index)
                  ? "0 0 0 0.3rem"
                  : undefined
              }
              _focus={{
                boxShadow: selectedImages.find((x) => x.index === index)
                  ? "0 0 0 0.3rem"
                  : "outline",
              }}
              color={
                selectedImages.length < 2 || isValid ? "blue.500" : "red.500"
              }
              p={0}
              overflow="hidden"
              opacity={
                selectedImages.length >= 2 &&
                !selectedImages.find((x) => x.index === index)
                  ? 0.6
                  : 1
              }
              fontSize="xs"
            >
              <Image
                ignoreFallback
                objectFit="cover"
                src={item}
                alt={`Image ${index}`}
              />
            </Button>
          </AspectRatio>
        ))}
      </SimpleGrid>
      {isReady && (
        <Alert status="success" variant="solid" borderRadius="md">
          <AlertIcon />
          Perfect, the two images are identical!
        </Alert>
      )}
      {children}
    </FormGroup>
  );
};

export const FieldPickIdenticalImages = deepMemo(FieldPickIdenticalImagesBase);
