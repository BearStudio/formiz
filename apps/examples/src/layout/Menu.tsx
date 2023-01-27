import React from "react";
import { Stack, useColorMode, Flex, Switch, Icon } from "@chakra-ui/react";
import { MenuItem } from "./MenuItem";
import { FiExternalLink, FiMoon, FiSun } from "react-icons/fi";

export const Menu = ({ direction = "left" }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack spacing="1" w="100%">
      <Stack spacing="0">
        <MenuItem direction={direction} href="/">
          AutoForm
        </MenuItem>
        <MenuItem direction={direction} href="/wizard">
          Wizard
        </MenuItem>
        <MenuItem direction={direction} href="/repeater">
          Repeater
        </MenuItem>
        <MenuItem direction={direction} href="/exotic-fields">
          Exotic Fields
        </MenuItem>
        <MenuItem direction={direction} href="/lot-of-fields">
          Lot of fields
        </MenuItem>
        <MenuItem direction={direction} href="/dynamic-steps">
          Dynamic Steps
        </MenuItem>
        <MenuItem direction={direction} href="/steppers">
          Steppers
        </MenuItem>
        <MenuItem direction={direction} href="/nested-forms">
          Nested forms
        </MenuItem>
        <MenuItem direction={direction} href="/real-life-1">
          Real life #1
        </MenuItem>
      </Stack>
      <Stack spacing="0">
        <MenuItem
          direction={direction}
          mt="6"
          as="a"
          href="https://formiz-react.com"
          target="_blank"
          fontSize="sm"
        >
          Formiz website
          <Icon as={FiExternalLink} ml="1" />
        </MenuItem>
        <MenuItem
          direction={direction}
          as="a"
          href="https://github.com/ivan-dalmet/formiz"
          target="_blank"
          fontSize="sm"
        >
          GitHub
          <Icon as={FiExternalLink} ml="1" />
        </MenuItem>
      </Stack>
      <Flex
        justifyContent={direction === "left" ? "flex-start" : "flex-end"}
        px="6"
        pt="8"
      >
        <Stack direction="row" align="center" mb="1">
          <Icon
            as={FiMoon}
            size="14px"
            opacity={colorMode !== "dark" ? "0.3" : undefined}
          />
          <Switch
            size="md"
            isChecked={colorMode === "light"}
            onChange={toggleColorMode}
            colorScheme="none"
          />
          <Icon
            as={FiSun}
            size="14px"
            opacity={colorMode !== "light" ? "0.3" : undefined}
          />
        </Stack>
      </Flex>
    </Stack>
  );
};
