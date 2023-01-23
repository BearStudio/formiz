import { Button, Icon } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

export const AddPlaceholder = ({ label = "Add", ...props }) => {
  return (
    <Button
      role="group"
      my="6"
      w="full"
      h="auto"
      display="flex"
      justifyContent="start"
      p="4"
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.200"
      borderRadius="md"
      transition="0.2s"
      _hover={{ borderColor: "gray.400" }}
      _focus={{ outline: "none", boxShadow: "outline" }}
      _active={{ bg: "gray.200" }}
      _dark={{
        bg: "gray.900",
        borderColor: "gray.700",
        _hover: { borderColor: "gray.600" },
        _active: { bg: "gray.800" },
      }}
      {...props}
    >
      <Button
        as="span"
        leftIcon={<Icon as={FiPlus} />}
        size="sm"
        variant="outline"
        bg="gray.100"
        border="none"
        _groupHover={{ bg: "gray.200" }}
        _dark={{
          bg: "gray.700",
          _groupHover: {
            bg: "gray.600",
          },
        }}
      >
        {label}
      </Button>
    </Button>
  );
};
