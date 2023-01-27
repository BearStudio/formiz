import React, { useState } from "react";

import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { deepMemo, FieldProps, useField } from "@formiz/core";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

export type FieldInputProps = FieldProps<string> &
  FormGroupProps &
  Pick<InputProps, "type" | "placeholder" | "autoFocus" | "size"> & {
    isLoading?: boolean;
  };

const FieldInputBase = (props: FieldInputProps) => {
  const {
    errorMessage,
    id,
    isValid,
    isRequired,
    isValidating,
    isProcessing,
    isDebouncing,
    isReady,
    isPristine,
    setValue,
    value,
    setIsTouched,
    shouldDisplayError,
    otherProps: {
      children,
      label,
      type,
      placeholder,
      helper,
      size,
      autoFocus = false,
      isLoading = false,
      ...rest
    },
  } = useField(props);

  const { name } = props;
  const [showPassword, setShowPassword] = useState(false);

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
      <InputGroup size={size}>
        <Input
          type={showPassword ? "text" : type || "text"}
          id={id}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsTouched(false)}
          onBlur={() => setIsTouched(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          name={name}
        />

        {type === "password" && (
          <InputLeftElement>
            <IconButton
              onClick={() => setShowPassword((x) => !x)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              display="flex"
              size="xs"
              fontSize="lg"
              icon={showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
              variant="unstyled"
            />
          </InputLeftElement>
        )}

        <InputLeftElement>
          {isReady && "✅"}
          {isProcessing && "⏳"}
          {!isValid && "❌"}
        </InputLeftElement>

        <InputRightElement>
          {isDebouncing && "✋🏼"}
          {isValidating || isLoading ? (
            <Spinner size="sm" flex="none" />
          ) : (
            isPristine && "✨"
          )}
        </InputRightElement>
      </InputGroup>
      {children}
    </FormGroup>
  );
};

export const FieldInput = deepMemo(FieldInputBase);
