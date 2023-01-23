import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const Other = () => {
  return (
    <Box m="auto" maxW="4xl" p="8">
      <Link href="/debug" passHref>
        <Button mr={4} as="a">
          Go to /
        </Button>
      </Link>
      <Link href="/debug/steps" passHref>
        <Button as="a">Go to /steps</Button>
      </Link>
    </Box>
  );
};

export default Other;
