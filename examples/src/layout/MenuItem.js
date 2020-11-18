/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { useDarkTheme } from '../hooks/isDarkTheme';
import { useNavBarContext } from './NavBarContext';

const propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['left', 'right']),
  to: PropTypes.string,
};
const defaultProps = {
  children: '',
  direction: 'left',
  to: null,
};

export const MenuItem = ({
  children, direction, to, ...props
}) => {
  const { onClose } = useNavBarContext();
  const isDarkTheme = useDarkTheme();
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Box
      as={Link}
      to={to}
      onClick={onClose}
      px="5"
      py="1"
      mr="-1px"
      fontWeight="bold"
      borderLeft={direction === 'left' ? '3px solid transparent' : null}
      borderRight={direction === 'right' ? '3px solid transparent' : null}
      borderColor={isActive
        ? (isDarkTheme ? 'gray.200' : 'gray.700')
        : null}
      color={isActive
        ? (isDarkTheme ? 'gray.200' : 'gray.700')
        : (isDarkTheme ? 'gray.400' : 'gray.500')}
      transition="0.2s"
      textAlign={direction === 'left' ? 'left' : 'right'}
      _hover={{
        textDecoration: 'none',
        color: isDarkTheme ? 'gray.200' : 'gray.700',
        borderColor: !isActive ? 'gray.300' : null,
      }}
      _focus={{
        outline: 'none',
        color: isDarkTheme ? 'gray.200' : 'gray.700',
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;
