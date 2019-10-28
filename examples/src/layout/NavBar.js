import React, { useRef } from 'react';
import {
  Flex,
  Image,
  Box,
  Button,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/core';
import { FaBars } from "react-icons/fa";
import logo from './logo.svg';
import { Menu } from './Menu';

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <Flex
      py={{ base: 2, md: 4 }}
      px={{ base: 4, md: 0 }}
      borderRightWidth={{ base: 0, md: 1 }}
      borderBottomWidth={{ base: 1, md: 0 }}
      borderColor="gray.200"
      flexDir={{ md: 'column' }}
      minW="15rem"
      w={{ md: '30vw' }}
      maxH="100vh"
      overflowY="auto"
      overflowX="hidden"
      align={{ base: 'center', md: 'flex-end' }}
      backgroundColor={{ base: 'white', md: 'gray.50' }}
      shadow={{ base: 'md', md: 'none' }}
    >
      <Flex
        as="a"
        href="https://formiz-react.com"
        textAlign="right"
        px="6"
        flexDir="column"
        align="flex-end"
        mb={{ md: 6 }}
      >
        <Image src={logo} w={{ base: '8rem', md: '10rem' }} />
        <Box
          fontWeight="bold"
          textTransform="uppercase"
          fontSize={{ base: '0.6rem', md: 'xs' }}
          color="brand.500"
          mt={-2}
        >
          Examples
        </Box>
      </Flex>

      <Box d={{ base: 'none', md: 'block' }}>
        <Menu direction="right" />
      </Box>

      <Box d={{ md: 'none' }} ml="auto">
        <Button ref={btnRef} onClick={onOpen} variant="ghost">
          <Box as={FaBars} size="1rem" mb="1px" mr="2" />
          Menu
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Examples</DrawerHeader>
            <DrawerBody pl="0">
              <Menu />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Flex>
  );
};
