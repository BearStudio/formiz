import React, { ReactNode } from "react";

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  SlideFade,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import { DebugRender } from "../DebugRender";

export type FormGroupProps = Omit<
  FormControlProps,
  "onChange" | "defaultValue" | "label" | "placeholder"
> & {
  children?: ReactNode;
  errorMessage?: ReactNode;
  helper?: ReactNode;
  id?: string;
  isRequired?: boolean;
  label?: ReactNode;
  showError?: boolean;
};

export const FormGroup = ({
  children,
  errorMessage,
  helper,
  id,
  isRequired,
  label,
  showError,
  ...props
}: FormGroupProps) => (
  <FormControl isInvalid={showError} isRequired={isRequired} {...props}>
    <FormLabel display="flex" alignItems="center" htmlFor={id}>
      <DebugRender mr="2" fontSize="xs" /> {label}
    </FormLabel>
    {children}
    {!!helper && <FormHelperText>{helper}</FormHelperText>}
    {!!errorMessage && (
      <FormErrorMessage>
        <SlideFade in offsetY={-6}>
          <Icon as={FiAlertCircle} me="2" />
          {errorMessage}
        </SlideFade>
      </FormErrorMessage>
    )}
  </FormControl>
);
