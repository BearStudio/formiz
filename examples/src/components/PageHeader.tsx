import React from 'react';
import {
  Button, Heading, Link, Box,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useForm } from '@formiz/core';

export const PageHeader = ({ children, onReset = () => {}, githubPath }) => {
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
