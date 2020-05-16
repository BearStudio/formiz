import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Formiz, useForm } from '../../src';
import { UseFormProps } from '../../src/types/form.types';

export const renderUseForm = (props: UseFormProps, fields?: React.ReactNode): any => {
  const formValues = { current: {} };
  const handleChange = (values: any) => {
    formValues.current = values;
  };

  const wrapper = ({ children }: any) => (
    <Formiz onChange={handleChange}>
      {children}
      {fields}
    </Formiz>
  );
  const fromHook = renderHook(() => useForm(props), { wrapper });

  const customAct = (async (callback = () => {}) => {
    act(() => {
      callback();
    });
    await fromHook.waitForNextUpdate();
  });

  return {
    act: customAct, formValues, ...fromHook,
  };
};

export const getUseFormUtils = () => {
  const onChangeValue = { current: null };
  const handleChange = (value: any) => {
    onChangeValue.current = value;
  };
  return { onChangeValue, onChange: handleChange };
};
