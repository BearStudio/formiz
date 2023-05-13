import { FieldProps } from "@/types";

export const getFieldValidationsErrors = <Value>(
  value: Value,
  formattedValue: Value,
  required: FieldProps<Value>["required"],
  validations: FieldProps<Value>["validations"]
) => {
  const requiredErrors =
    !!required && !formattedValue && formattedValue !== 0
      ? [required !== true ? required : undefined]
      : [];

  // Sync Validations
  const validationsErrors = (validations ?? [])
    .filter(
      (validation) =>
        (validation.checkFalsy || !!formattedValue || formattedValue === 0) &&
        !validation.handler(formattedValue, value)
    )
    .map(({ message }) => message);

  return { requiredErrors, validationsErrors };
};
