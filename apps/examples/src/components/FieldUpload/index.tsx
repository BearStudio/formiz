import React, { ChangeEvent } from "react";

import { deepMemo, FieldProps, useField } from "@formiz/core";
import { chakra, Icon, useToken } from "@chakra-ui/react";
import { FiPaperclip } from "react-icons/fi";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

type Value = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
  file: File;
};

export type FieldUploadProps = FieldProps<Value> & FormGroupProps;

const FieldUploadBase = (props: FieldUploadProps) => {
  const {
    errorMessage,
    id,
    isRequired,
    setValue,
    value,
    shouldDisplayError,
    otherProps: { children, label, helper, ...rest },
  } = useField(props, {
    validations: [
      {
        handler: (v: { size: number }) => v.size < 1024 * 100,
        message: "File limit exeeded (100ko)",
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

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];

    if (!file) {
      setValue(null);
      return;
    }

    setValue({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified),
      file,
    });
  };

  const [redColor, blueColor] = useToken("colors", ["red.500", "blue.500"]);

  return (
    <FormGroup {...formGroupProps}>
      <chakra.label
        position="relative"
        bg="white"
        display="flex"
        alignItems="center"
        px="3"
        py="2"
        borderRadius="md"
        border="1px solid"
        borderColor={shouldDisplayError ? redColor : "gray.200"}
        boxShadow={shouldDisplayError ? `0 0 0 1px ${redColor}` : undefined}
        color="gray.600"
        transition="0.2s"
        _dark={{ bg: "gray.900", borderColor: "gray.700", color: "gray.100" }}
        _hover={{
          bg: "blue.50",
          borderColor: "blue.600",
          _dark: { bg: "gray.800", borderColor: "gray.600" },
        }}
        _focusWithin={{
          bg: "bleu.50",
          borderColor: "blue.600",
          boxShadow: `0 0 0 1px ${blueColor}`,
          _dark: { bg: "gray.800", borderColor: "gray.600" },
        }}
      >
        <chakra.input
          opacity={0}
          position="absolute"
          top={0}
          left={0}
          width={0}
          type="file"
          id={id}
          onChange={handleChange}
        />
        <Icon as={FiPaperclip} mr="2" /> {value?.name || "Select file"}
      </chakra.label>
      {children}
    </FormGroup>
  );
};

export const FieldUpload = deepMemo(FieldUploadBase);
