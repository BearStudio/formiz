import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../Form/Context';
import { stepRegister, stepUnregister, stepSetVisited } from '../Form/Context/actions';
import { getStep, getCurrentStepNameFromState } from '../Form/Context/helpers';
import { ErrorStepWithoutName } from './errors';

export const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.string.isRequired,
  order: PropTypes.number,
};

export const defaultProps = {
  children: '',
  order: 0,
};

export const FormStep = ({
  children,
  name,
  order,
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
