import React from "react";

import { Button, ButtonGroup, FormErrorMessage } from "@chakra-ui/react";
import { useField, deepMemo, FieldProps } from "@formiz/core";

import { FormGroup, FormGroupProps } from "@/components/FormGroup";

type Option = {
  id: number;
  label: string;
};

type Value = Option;

export type FieldObjectProps = FormGroupProps &
  FieldProps<Value> & {
    options?: Option[];
  };

export const FieldObjectBase = (props: FieldObjectProps) => {
  const {
    value,
    setValue,
    errorMessage,
    otherProps: { options, ...formGroupProps },
  } = useField(props);

  return (
    <FormGroup {...formGroupProps}>
      <ButtonGroup>
        {options?.map((option: Option) => (
          <Button
            key={option.id}
            size="sm"
            colorScheme={value?.id === option.id ? "blue" : "gray"}
            onClick={() =>
              setValue((prevValue) =>
                prevValue?.id === option.id ? null : option
              )
            }
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormGroup>
  );
};

export const FieldObject = deepMemo(FieldObjectBase);
