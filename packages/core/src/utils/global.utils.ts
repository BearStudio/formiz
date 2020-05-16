export const getUniqueId = (key: string): string => `formiz-${key}-id-${Math.random().toString(36).substr(2, 9)}`;
