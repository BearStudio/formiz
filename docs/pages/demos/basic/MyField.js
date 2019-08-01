import React from 'react';
import { useField } from '../../../../packages/core/src';

export const MyField = (props) => {
  const {
    value, setValue, errorMessage, isValid,
  } = useField(props);
  const { label } = props;
  return (
    <div className="form-group">
      <label>
        { label }
      </label>
      <input
        type="text"
        className={`form-control ${!isValid ? 'is-invalid' : ''}`}
        defaultValue={value}
        onChange={e => setValue(e.target.value)}
      />
      {!isValid && (
        <div className="invalid-feedback">
          { errorMessage }
        </div>
      )}
    </div>
  );
};
