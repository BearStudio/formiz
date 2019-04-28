import React from 'react';
import PropTypes from 'prop-types';
import { useFormiz } from '../../contexts/form';

export const Form = ({ children }) => {
  const test = useFormiz('plop');
  console.log(test);

  return (
    <form>
      { children }
    </form>
  );
};

Form.propTypes = {
  children: PropTypes.node,
};

Form.defaultProps = {
  children: '',
};
