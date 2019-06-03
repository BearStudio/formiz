import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../Form/Context';
import { stepRegister, stepUnregister } from '../Form/Context/actions';
import { ErrorStepWithoutName, ErrorStepWithoutOrder } from './errors';

export const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
};

export const defaultProps = {
  children: '',
};

export const FormStep = ({
  children,
  name,
  order,
}) => {
  if (!name) {
    throw ErrorStepWithoutName;
  }

  if (!order && order !== 0) {
    throw ErrorStepWithoutOrder;
  }

  const { state, dispatch } = useFormContext();
  const { currentStepName } = state;

  const isActive = currentStepName === name;

  useEffect(() => {
    dispatch(stepRegister(name, order));

    return () => {
      dispatch(stepUnregister(name));
    };
  }, [name, order]);

  if (typeof children === 'function') {
    return children({
      isActive,
    });
  }

  return (
    <div
      style={{
        display: !isActive ? 'none' : null,
        pointerEvents: !isActive ? 'none' : null,
      }}
    >
      {children}
    </div>
  );
};


FormStep.propTypes = propTypes;
FormStep.defaultProps = defaultProps;
