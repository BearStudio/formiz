import PropTypes from 'prop-types';

export const propTypes = {
  children: PropTypes.node,
};

export const defaultProps = {
  children: '',
};

export const FormStep = ({
  children,
}) => children;


FormStep.propTypes = propTypes;
FormStep.defaultProps = defaultProps;
