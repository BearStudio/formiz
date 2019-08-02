import React from 'react';
import propTypes from 'prop-types';

export const Button = ({
  as: Tag,
  className,
  isDisabled,
  color,
  ...attrs
}) => {
  const defaultStyle = 'block w-full text-sm font-bold py-3 px-4 bg-transparent rounded appearance-none border-solid border-gray-300 focus:outline-none focus:shadow-outline';
  const primaryStyle = color === 'primary' ? 'bg-blue-500 text-white border-none' : '';
  const disabledStyle = isDisabled ? 'opacity-25' : 'hover:shadow-outline';
  return (
    <Tag
      className={`
        ${className}
        ${defaultStyle}
        ${primaryStyle}
        ${disabledStyle}
      `}
      disabled={isDisabled}
      {...attrs}
    />
  );
};

Button.propTypes = {
  as: propTypes.string,
  className: propTypes.string,
  color: propTypes.string,
  isDisabled: propTypes.bool,
};

Button.defaultProps = {
  as: 'button',
  className: '',
  color: '',
  isDisabled: false,
};
