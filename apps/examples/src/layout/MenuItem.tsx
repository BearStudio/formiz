/* eslint-disable no-nested-ternary */
import React from "react";
import { Box } from "@chakra-ui/react";
import { useNavBarContext } from "./NavBarContext";
import Link from "next/link";
import { useRouter } from "next/router";

export const MenuItem = ({ children, direction, href, ...props }: any) => {
  const { onClose } = useNavBarContext();
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <Box
      as={Link}
      href={href}
      onClick={onClose}
      px="5"
      py="1"
      fontWeight="bold"
      outline="none"
      borderLeft={direction === "left" ? "3px solid transparent" : undefined}
      borderRight={direction === "right" ? "3px solid transparent" : undefined}
      borderColor={isActive ? "gray.700" : undefined}
      color={isActive ? "gray.700" : "gray.500"}
      transition="0.2s"
      textAlign={direction === "left" ? "left" : "right"}
      _dark={{
        color: isActive ? "gray.200" : "gray.400",
        borderColor: isActive ? "gray.200" : undefined,
      }}
      _hover={{
        textDecoration: "none",
        color: "gray.700",
        borderColor: !isActive ? "gray.300" : undefined,
        _dark: {
          color: "gray.200",
        },
      }}
      _focusVisible={{
        color: "gray.700",
        borderColor: "gray.300",
        _dark: {
          color: "gray.200",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
