import * as React from 'react';
import { useField } from '../../src';

export const Field = (props: any) => {
  const { id, value, setValue } = useField(props);
  const { label, name } = props;

  return (
    <>
      <label htmlFor={id}>
        {label || name}
      </label>
      <input id={id} data-testid={name} value={value || ''} onChange={(e) => setValue(e.target.value)} />
    </>
  );
};
