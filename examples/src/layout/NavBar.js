import React from 'react';
import { Flex } from '@chakra-ui/core';
import { NavBarItem } from './NavBarItem';

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
