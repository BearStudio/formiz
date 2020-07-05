export const getFormUniqueId = (): string => `form-${Math.random().toString(36).substr(2, 9)}`;
export const getFieldUniqueId = (): string => `field-${Math.random().toString(36).substr(2, 9)}`;
export const getFieldHtmlUniqueId = (formId: string, fieldName: string): string => `formiz-${formId}-field-${fieldName}`;
