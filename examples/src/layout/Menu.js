import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack, Icon, Link,
} from '@chakra-ui/core';
import { MenuItem } from './MenuItem';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
};
const defaultProps = {
  direction: 'left',
};

export const Menu = ({ direction }) => (
  <Stack spacing="0" w="100%">
    <MenuItem
      direction={direction}
      to="/"
    >
      AutoForm
    </MenuItem>
    <MenuItem
      direction={direction}
      to="/wizard"
    >
      Wizard
    </MenuItem>
    <MenuItem
      direction={direction}
      to="/repeater"
    >
      Repeater
    </MenuItem>
    <MenuItem
      direction={direction}
      to="/lot-of-fields"
    >
      Lot of fields
    </MenuItem>
    <MenuItem
      direction={direction}
      to="/real-life-1"
    >
      Real life #1
    </MenuItem>

    <MenuItem
      direction={direction}
      mt="6"
      as={Link}
      href="https://formiz-react.com"
      target="_blank"
      fontSize="sm"
    >
      Formiz website
      <Icon name="external-link" ml="1" mb="1" />
    </MenuItem>
    <MenuItem
      direction={direction}
      as={Link}
      href="https://github.com/ivan-dalmet/formiz"
      target="_blank"
      fontSize="sm"
    >
      GitHub
      <Icon name="external-link" ml="1" mb="1" />
    </MenuItem>
  </Stack>
);

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
