import * as React from "react";
import { renderHook } from "@testing-library/react";
import { Formiz, useField, FieldProps, useForm } from "../..";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();
  return <Formiz connect={form}>{children}</Formiz>;
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

export const FieldInputTest = ({
  stateToTest,
  onStateChange,
  ...props
}: FieldProps<string> & {
  onStateChange: (value: boolean) => void;
  stateToTest:
    | "isValidating"
    | "isValid"
    | "isPristine"
    | "isDebouncing"
    | "isProcessing";
}) => {
  const field = useField(props);

  const spiedState = field[stateToTest];

  React.useEffect(() => {
    onStateChange(spiedState);
  }, [spiedState, onStateChange]);

  return (
    <input
      value={field.value ?? ""}
      onChange={(e) => field.setValue(e.target.value)}
    />
  );
};
