import React from "react";
import { Box, useToast } from "@chakra-ui/react";

export const useToastValues = <FormValues extends any>() => {
  const toast = useToast();

  return (values: FormValues) => {
    toast({
      title: "Submitted values",
      description: (
        <Box as="pre" maxHeight="80vh" maxWidth="80vw" overflow="auto">
          {JSON.stringify(values, null, 2)}
        </Box>
      ),
      status: "success",
      duration: null,
      isClosable: true,
      position: "bottom-left",
    });
  };
};
