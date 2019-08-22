import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import { stepRegister, stepUnregister, stepSetVisited } from '../FormContext/actions';
import { getStep, getCurrentStepNameFromState } from '../FormContext/helpers';
import { ErrorStepWithoutName } from './errors';

export const propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    ])),
  ]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  order: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const defaultProps = {
  as: 'div',
  children: '',
  label: '',
  order: 0,
  style: {},
};

export const FormStep = ({
  as: Tag,
  children,
  name,
  label,
  order,
  style,
  ...props
}) => {
  if (!name) {
    throw ErrorStepWithoutName;
  }

  const { state, dispatch } = useFormContext();

  const currentStepName = getCurrentStepNameFromState(state);
  const currentStep = getStep(currentStepName, state.steps);
  const isActive = currentStepName === name;

  if (currentStep.name && !currentStep.isVisited && isActive) {
    dispatch(stepSetVisited(currentStepName));
  }

  useEffect(() => {
    dispatch(stepRegister(name, order, label));

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
    <Tag
      style={{
        ...style,
        display: !isActive ? 'none' : null,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};


FormStep.propTypes = propTypes;
FormStep.defaultProps = defaultProps;
