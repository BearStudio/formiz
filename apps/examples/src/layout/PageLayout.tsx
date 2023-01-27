import React, { FC, PropsWithChildren } from "react";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { NavBar } from "./NavBar";
import { useFormContext, useFormFields } from "@formiz/core";

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      minH="100vh"
      m="auto"
      overflow="hidden"
      flexDirection={{ base: "column", lg: "row" }}
    >
      <NavBar />
      <Box flex="1" w="100%" position="relative">
        <Flex
          flex="1"
          minH="100vh"
          flexWrap="nowrap"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box flex="1" position="relative">
            <Box
              position={{ lg: "absolute" }}
              inset={{ lg: 0 }}
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
            w={{ lg: "30vw" }}
            maxH={{ lg: "100vh" }}
            overflow="auto"
            backgroundColor="gray.800"
            color="gray.100"
            p={{ base: 4, lg: 8 }}
            _dark={{
              backgroundColor: "gray.900",
            }}
          >
            <DebugOutput />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const DebugOutput = () => {
  const form = useFormContext();
  const fields = useFormFields();
  return (
    <Stack spacing={4}>
      <Stack>
        <Heading fontFamily="mono" size="sm">
          # useFormContext()
        </Heading>
        <Box as="pre">{JSON.stringify(form, null, 2)}</Box>
      </Stack>
      <Stack>
        <Heading fontFamily="mono" size="sm">
          # useFormFields()
        </Heading>
        <Box as="pre">{JSON.stringify(fields, null, 2)}</Box>
      </Stack>
    </Stack>
  );
};
