import React from 'react';
import propTypes from 'prop-types';

export const NotReady = ({ of }) => (
  <div className="callout is-warning">
    Work in Progress.
    {' '}
    <strong>
      @formiz/
      {of}
    </strong>
    {' '}
    is not published on NPM yet.
  </div>
);

NotReady.propTypes = {
  of: propTypes.string,
};

NotReady.defaultProps = {
  of: 'core',
};
