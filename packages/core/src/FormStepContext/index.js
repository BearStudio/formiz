import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from '../FormContext';
import {
  stepRegister, stepUnregister, stepSetVisited, stepUpdate, stepGoPrev,
} from '../FormContext/actions';
import { ErrorStepWithoutName } from './errors';
import { getExposedState } from '../useForm/getExposedState';

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

export const FormStepContext = React.createContext();

export const useFormStepName = () => useContext(FormStepContext);

export const FormStepContextProvider = ({
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

  const formContext = useFormContext();
  const { currentStep } = getExposedState(formContext);
  const { dispatch } = formContext;

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

  return (
    <FormStepContext.Provider value={name}>
      <Tag
        style={{
          ...style,
          display: !isActive ? 'none' : null,
        }}
        {...props}
      >
        {isEnabled && children}
      </Tag>
    </FormStepContext.Provider>
  );
};

FormStepContextProvider.propTypes = propTypes;

FormStepContextProvider.defaultProps = defaultProps;
