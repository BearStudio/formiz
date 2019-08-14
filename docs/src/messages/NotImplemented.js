import React from 'react';
import propTypes from 'prop-types';

export const NotImplemented = ({ of }) => (
  <div className="callout is-warning">
    Work in Progress.
    {' '}
    <strong>{of}</strong>
    {' '}
    is not implemented yet.
  </div>
);

NotImplemented.propTypes = {
  of: propTypes.string,
};

NotImplemented.defaultProps = {
  of: 'This',
};
