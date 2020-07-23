import React from 'react';
import PropTypes from 'prop-types';
import {
  Stack, Icon, Link, useColorMode, Flex, Switch,
} from '@chakra-ui/core';
import { MenuItem } from './MenuItem';

const propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
};
const defaultProps = {
  direction: 'left',
};

export const Menu = ({ direction }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
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
        to="/exotic-fields"
      >
        Exotic Fields
      </MenuItem>
      <MenuItem
        direction={direction}
        to="/lot-of-fields"
      >
        Lot of fields
      </MenuItem>
      <MenuItem
        direction={direction}
        to="/dynamic-steps"
      >
        Dynamic Steps
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
      <Flex justifyContent={direction === 'left' ? 'flex-start' : 'flex-end'} px="6" pt="8">
        <Stack isInline align="center" mb="1">
          <Icon name="moon" size="14px" opacity={colorMode !== 'dark' ? '0.3' : null} />
          <Switch
            size="md"
            isChecked={colorMode === 'light'}
            onChange={toggleColorMode}
            color="none"
          />
          <Icon name="sun" size="14px" opacity={colorMode !== 'light' ? '0.3' : null} />
        </Stack>
      </Flex>
    </Stack>
  );
};

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
