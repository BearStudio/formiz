import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Formiz, useField } from '../../src';
import { UseFieldProps } from '../../src/types/field.types';

export const renderUseField = (props: UseFieldProps): any => {
  const formValues = { current: {} };
  const handleChange = (values: any) => {
    formValues.current = values;
  };

  const wrapper = ({ children }: any) => <Formiz onChange={handleChange}>{children}</Formiz>;
  const fromHook = renderHook(() => useField(props), { wrapper });

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

export const getUseFieldUtils = () => {
  const onChangeValue = { current: null };
  const handleChange = (value: any) => {
    onChangeValue.current = value;
  };
  return { onChangeValue, onChange: handleChange };
};
