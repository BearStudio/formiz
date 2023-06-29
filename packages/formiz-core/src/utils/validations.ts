import { FieldProps } from "@/types";

export const getFieldValidationsErrors = <Value, FormattedValue>(
  value: Value,
  formattedValue: FormattedValue,
  required: FieldProps<Value, FormattedValue>["required"],
  validations: FieldProps<Value, FormattedValue>["validations"]
) => {
  const requiredErrors =
    !!required &&
    (typeof formattedValue === "string"
      ? !formattedValue.trim()
      : !formattedValue) &&
    formattedValue !== 0
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
