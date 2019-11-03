import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack, Box, Flex } from '@chakra-ui/core';
import { Debug } from '../components/Debug';

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {
  children: '',
};

const useDebugTime = () => {
  const initTimeRef = useRef(new Date());

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('--- Time from 1st render ---');
  }, []);

  useEffect(() => {
    const currentTime = new Date();
    // eslint-disable-next-line no-console
    console.log(Math.abs(currentTime - initTimeRef.current) / 1000);
  });
};

export const PageLayout = ({ children }) => {
  useDebugTime();

  return (
    <Stack
      flex="1"
      minH="100vh"
      flexWrap="nowrap"
      direction={{ base: 'column', lg: 'row' }}
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
        backgroundColor="gray.800"
        p={{ base: 4, lg: 8 }}
      >
        <Debug />
      </Flex>
    </Stack>
  );
};

PageLayout.propTypes = propTypes;
PageLayout.defaultProps = defaultProps;
