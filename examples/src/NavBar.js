import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flex, PseudoBox } from '@chakra-ui/core';

const NavBarItem = ({ children, to, ...props }) => {
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

export const NavBar = () => (
  <Flex
    mb="6"
    py="4"
    borderRight="1px solid"
    borderColor="gray.200"
    flexDir="column"
  >
    <NavBarItem
      to="/"
    >
        AutoForm
    </NavBarItem>
    <NavBarItem
      to="/wizard"
    >
        Wizard
    </NavBarItem>
    <NavBarItem
      to="/repeater"
    >
        Repeater
    </NavBarItem>
    <NavBarItem
      to="/lot-of-fields"
    >
        Lot of fields
    </NavBarItem>
    <NavBarItem
      to="/use-case-1"
    >
        Use Case 1
    </NavBarItem>
  </Flex>
);
