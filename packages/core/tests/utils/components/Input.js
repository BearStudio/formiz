import React from 'react';
import { useField } from '../../../src';

export const Input = (props) => {
  const { value, setValue } = useField(props);

  return (<input value={value || ''} onChange={e => setValue(e.target.value)} />);
};
