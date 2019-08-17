import React from 'react';
import PropTypes from 'prop-types';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live';
// nightOwlTheme is default Docusaurus code theme and available with Docusaurus.
// eslint-disable-next-line import/no-extraneous-dependencies
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import {
  Formiz, FormizStep, useForm, useField,
} from '@formiz/core';

export const CodePreview = ({ code }) => (
  <LiveProvider
    code={(code).trim()}
    scope={{
      React,
      Formiz,
      FormizStep,
      useForm,
      useField,
    }}
    theme={nightOwlTheme}
    noInline
  >
    <div className="relative mx-4 xxl:mx-0 z-20 shadow-lg rounded-lg overflow-hidden bg-white">
      <LivePreview />
    </div>
    <LiveError />
    <div className="relative z-10 xxl:-mx-20 -mt-6 px-2 pb-2 pt-10 rounded-lg overflow-hidden" style={{ background: '#011627' }}>
      <LiveEditor />
    </div>
  </LiveProvider>
);

CodePreview.propTypes = {
  code: PropTypes.string.isRequired,
};
