import React from 'react';
import { useField } from '@formiz/core';
import { Input } from './Input';

export const MyField = (props) => {
  const {
    value, setValue, errorMessage, isValid,
  } = useField(props);
  const { label } = props;
  return (
    <div className="mb-4">
      <label className="block font-bold text-sm text-gray-600 mb-1">
        { label }
      </label>
      <Input
        type="text"
        defaultValue={value}
        onChange={e => setValue(e.target.value)}
      />
      {!isValid && (
        <div className="block text-sm text-red-600 mt-1">
          { errorMessage }
        </div>
      )}
    </div>
  );
};
