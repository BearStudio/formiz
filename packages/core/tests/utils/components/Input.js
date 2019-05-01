import React from 'react';
import { useFormiz } from '../../../src';

export const Input = (props) => {
  const { value, setValue } = useFormiz(props);

  return (<input value={value || ''} onChange={e => setValue(e.target.value)} />);
};
