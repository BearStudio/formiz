import React from "react";
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
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { Menu } from "./Menu";
import { NavBarContext } from "./NavBarContext";

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <NavBarContext.Provider value={{ isOpen, onOpen, onClose }}>
      <Flex
        py={{ base: 2, lg: 4 }}
        px={{ base: 4, lg: 0 }}
        borderRightWidth={{ base: 0, lg: 1 }}
        borderBottomWidth={{ base: 1, lg: 0 }}
        borderColor="gray.200"
        flexDir={{ lg: "column" }}
        minW="15rem"
        maxH="100vh"
        overflowY="auto"
        overflowX="hidden"
        align={{ base: "center", lg: "flex-end" }}
        backgroundColor={{
          base: "white",
          lg: "gray.50",
        }}
        boxShadow={{ base: "md", lg: "none" }}
        _dark={{
          borderColor: "gray.900",
          backgroundColor: { base: "gray.900", lg: "gray.700" },
        }}
      >
        <Flex
          textAlign="right"
          px="6"
          flexDir="column"
          align="flex-end"
          mb={{ lg: 6 }}
        >
          <Image
            src="/logo.svg"
            alt="Formiz"
            w={{ base: "8rem", lg: "10rem" }}
          />
          <Box
            fontWeight="bold"
            textTransform="uppercase"
            fontSize={{ base: "0.6rem", lg: "xs" }}
            color="gray.500"
            mt={-2}
          >
            Examples
          </Box>
        </Flex>

        <Box display={{ base: "none", lg: "block" }}>
          <Menu direction="right" />
        </Box>

        <Box display={{ lg: "none" }} ml="auto">
          <Button onClick={onOpen} variant="ghost">
            <Box as={FaBars} size="1rem" mb="1px" mr="2" />
            Menu
          </Button>
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
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
    </NavBarContext.Provider>
  );
};
