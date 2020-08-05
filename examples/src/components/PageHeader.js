import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Heading, Link, Box,
} from '@chakra-ui/core';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useForm } from '@formiz/core';


const propTypes = {
  children: PropTypes.node,
  onReset: PropTypes.func,
  githubPath: PropTypes.string,
};
const defaultProps = {
  children: '',
  onReset: () => {},
  githubPath: null,
};


export const PageHeader = ({ children, onReset, githubPath }) => {
  const form = useForm({ subscribe: false });

  return (
    <Box mb="6" data-test="header">
      <Heading d="flex" alignItems="center">
        {children}
        <Button
          onClick={() => {
            form.reset();
            onReset();
          }}
          ml="auto"
          size="sm"
        >
          Reset form
        </Button>
      </Heading>
      {!!githubPath && (
        <Link
          isExternal
          fontSize="sm"
          href={`https://github.com/ivan-dalmet/formiz/tree/master/examples/src/pages/${githubPath}`}
        >
          View code on GitHub
          <ExternalLinkIcon ml="1" mb="1" />
        </Link>
      )}
    </Box>
  );
};

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;
