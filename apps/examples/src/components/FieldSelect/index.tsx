import React, { ReactNode } from "react";

import { Select, SelectProps } from "@chakra-ui/react";
import { FieldProps, useField } from "@formiz/core";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

export type SelectOption = {
  label?: ReactNode;
  value: string | number;
};

type Value = SelectOption["value"];

export type FieldSelectProps<FormattedValue> = FieldProps<
  Value,
  FormattedValue
> &
  FormGroupProps &
  Pick<SelectProps, "placeholder" | "autoFocus" | "size"> & {
    isLoading?: boolean;
    options: SelectOption[];
  };

export const FieldSelect = <FormattedValue = Value,>(
  props: FieldSelectProps<FormattedValue>
) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    isRequired,
    setValue,
    value,
    shouldDisplayError,
    isPristine,
    setIsTouched,
    otherProps: {
      children,
      label,
      placeholder,
      helper,
      size,
      autoFocus = false,
      isLoading = false,
      options,
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
      <Select
        size={size}
        id={id}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsTouched(false)}
        onBlur={() => setIsTouched(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </Select>
      {children}
    </FormGroup>
  );
};
