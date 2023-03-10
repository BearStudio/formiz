import React from "react";

import { Textarea, TextareaProps } from "@chakra-ui/react";
import { deepMemo, FieldProps, useField } from "@formiz/core";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

type Value = string;

export type FieldTextareaProps<FormattedValue> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps &
  Pick<TextareaProps, "placeholder" | "autoFocus" | "size"> & {
    isLoading?: boolean;
  };

const FieldTextareaBase = <FormattedValue = Value,>(
  props: FieldTextareaProps<FormattedValue>
) => {
  const {
    errorMessage,
    id,
    isRequired,
    setValue,
    value,
    setIsTouched,
    shouldDisplayError,
    otherProps: {
      children,
      label,
      placeholder,
      helper,
      size,
      autoFocus = false,
      isLoading = false,
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
      <Textarea
        id={id}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsTouched(false)}
        onBlur={() => setIsTouched(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        size={size}
      />
    </FormGroup>
  );
};

export const FieldTextarea = deepMemo(FieldTextareaBase);
