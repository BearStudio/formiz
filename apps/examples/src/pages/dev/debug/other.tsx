import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const Other = () => {
  return (
    <Box m="auto" maxW="4xl" p="8">
      <Button mr={4} as={Link} href="/debug">
        Go to /
      </Button>
      <Button as={Link} href="/debug/steps">
        Go to /steps
      </Button>
    </Box>
  );
};

export default Other;
