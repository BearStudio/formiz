import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import {
  stepRegister, stepUnregister, stepSetVisited, stepUpdate, stepGoPrev,
} from '../FormContext/actions';
import { ErrorStepWithoutName } from './errors';
import { useFormState } from '../useFormState';

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
  isEnabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  order: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export const defaultProps = {
  as: 'div',
  children: '',
  isEnabled: true,
  label: '',
  order: 0,
  style: {},
};

export const FormStep = ({
  as: Tag,
  children,
  isEnabled,
  name,
  label,
  order,
  style,
  ...props
}) => {
  if (!name) {
    throw ErrorStepWithoutName;
  }

  const { dispatch } = useFormContext();
  const { currentStep } = useFormState();

  const isActive = currentStep.name === name;

  useEffect(() => {
    if (currentStep.name && !currentStep.isVisited && isActive) {
      dispatch(stepSetVisited(currentStep.name));
    }
  });

  useEffect(() => {
    if (isActive && !isEnabled) {
      dispatch(stepGoPrev());
    }
  }, [isEnabled, isActive]);

  useEffect(() => {
    dispatch(stepRegister(name, { order }));

    return () => {
      dispatch(stepUnregister(name));
    };
  }, [name, order]);

  useEffect(() => {
    dispatch(stepUpdate(name, { label, isEnabled: !!isEnabled }));
  }, [isEnabled, label]);

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
      {isEnabled && children}
    </Tag>
  );
};


FormStep.propTypes = propTypes;
FormStep.defaultProps = defaultProps;
