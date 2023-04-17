import * as React from "react";
import { renderHook } from "@testing-library/react";
import { Formiz, useField, FieldProps, useForm } from "../..";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();
  return <Formiz connect={form}> {children}</Formiz>;
};

export const renderUseField = <T extends any>(
  props: FieldProps<T>,
  withWrapper: boolean = true
) => {
  return renderHook(
    () => useField(props),
    withWrapper ? { wrapper: Wrapper } : {}
  );
};
