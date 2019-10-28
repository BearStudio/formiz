import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { PseudoBox } from '@chakra-ui/core';

const propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
};
const defaultProps = {
  children: '',
  to: '/',
};

export const NavBarItem = ({ children, to, ...props }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <PseudoBox
      as={Link}
      to={to}
      px="4"
      py="1"
      mr="-1px"
      fontWeight="bold"
      borderRight="3px solid transparent"
      borderColor={isActive ? 'gray.700' : null}
      color={isActive ? 'gray.700' : 'gray.500'}
      transition="0.2s"
      textAlign="right"
      _hover={{
        textDecoration: 'none',
        color: 'gray.700',
        borderColor: !isActive ? 'gray.300' : null,
      }}
      _focus={{
        outline: 'none',
        color: 'gray.700',
      }}
      {...props}
    >
      {children}
    </PseudoBox>
  );
};

NavBarItem.propTypes = propTypes;
NavBarItem.defaultProps = defaultProps;
