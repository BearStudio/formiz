import { FormFields } from './types/form.types';
import { Field } from './types/field.types';

export const registerField = (
  fields: FormFields,
  newField: Field,
): FormFields => {
  if (!newField) return fields;

  const field = fields.find((x: Field) => x.id === newField.id);
  const otherFields = fields.filter((x: Field) => x.id !== newField.id);

  if (JSON.stringify(newField) === JSON.stringify(field)) {
    return fields;
  }

  return [
    ...otherFields,
    { ...newField },
  ];
};


export const updateField = (
  fields: FormFields,
  newField: Field,
): FormFields => {
  if (!newField) return fields;

  const field = fields.find((x: Field) => x.id === newField.id);
  const otherFields = fields.filter((x: Field) => x.id !== newField.id);

  if (JSON.stringify(newField) === JSON.stringify(field)) {
    return fields;
  }

  return [
    ...otherFields,
    {
      ...newField,
    },
  ];
};

export const unregisterField = (
  fields: FormFields,
  fieldId: Field['id'],
): FormFields => {
  if (!fieldId) return fields;
  const otherFields = fields.filter((x: Field) => x.id !== fieldId);
  return [...otherFields];
};

export const setFieldsValues = (
  fields: FormFields,
  objectOfValues: any = {},
): FormFields => {
  if (!objectOfValues) return fields;

  const newFields = fields.map((field: Field) => ({
    ...field,
    value: objectOfValues[field.name] ?? field.value,
  }));

  return [...newFields];
};

export const setFieldsExternalErrors = (
  fields: FormFields,
  objectOfErrors: any = {},
): FormFields => {
  if (!objectOfErrors) return fields;

  const newFields = fields.map((field: Field) => ({
    ...field,
    externalErrors: objectOfErrors[field.name]
      ? [objectOfErrors[field.name], field.externalErrors]
      : field.externalErrors,
  }));

  return [...newFields];
};
