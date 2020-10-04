import React from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from '@chakra-ui/core';
import { Debug } from '../components/Debug';
import { useDarkTheme } from '../hooks/isDarkTheme';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: '',
};

export const PageLayout = ({ children }) => {
  const isDarkTheme = useDarkTheme();

  return (
    <Flex
      flex="1"
      minH="100vh"
      flexWrap="nowrap"
      flexDirection={{ base: 'column', lg: 'row' }}
    >
      <Box
        flex="1"
        position="relative"
      >
        <Box
          position={{ lg: 'absolute' }}
          top={{ lg: 0 }}
          left={{ lg: 0 }}
          right={{ lg: 0 }}
          bottom={{ lg: 0 }}
          overflow="auto"
          p={{ base: 4, lg: 8 }}
        >
          <Box maxW="40rem" mx="auto">
            {children}
          </Box>
        </Box>
      </Box>
      <Flex
        borderColor="gray.200"
        flexDir="column"
        minW="15rem"
        w={{ lg: '30vw' }}
        maxH={{ lg: '100vh' }}
        overflow="auto"
        backgroundColor={isDarkTheme ? 'gray.900' : 'gray.800'}
        color="gray.100"
        p={{ base: 4, lg: 8 }}
      >
        <Debug />
      </Flex>
    </Flex>
  );
};

PageLayout.propTypes = propTypes;
PageLayout.defaultProps = defaultProps;
