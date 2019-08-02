import React from 'react';
import propTypes from 'prop-types';

export const Input = ({
  as: Tag,
  isValid,
  ...attrs
}) => (
  <Tag
    className={`${!isValid ? 'border-red-600' : 'border-gray-300'} text-base bg-white focus:outline-none focus:shadow-outline border rounded py-1 px-2 block w-full appearance-none leading-normal`}
    {...attrs}
  />
);

Input.propTypes = {
  as: propTypes.string,
  isValid: propTypes.bool,
};

Input.defaultProps = {
  as: 'input',
  isValid: true,
};
