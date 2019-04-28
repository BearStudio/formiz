import React, { useContext } from 'react';

export const formContext = React.createContext('test');

export const useFormiz = (fieldName) => {
  const contextValue = useContext(formContext);
  return { contextValue, fieldName };
};
