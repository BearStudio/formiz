import * as React from "react";
import { renderHook } from "@testing-library/react";
import { Formiz, useField, FieldProps } from "../..";

export const renderUseField = <T extends any>(
  props: FieldProps<T>,
  withWrapper: boolean = true
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Formiz>{children}</Formiz>
  );
  return renderHook(() => useField(props), withWrapper ? { wrapper } : {});
};
