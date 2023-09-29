import React, { FC, ReactNode } from "react";
import { Button, Heading, Link, Box, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { useFormContext } from "@formiz/core";

export const PageHeader: FC<{
  children?: ReactNode;
  onReset?: () => void;
  githubPath?: string;
}> = ({ children, onReset = () => {}, githubPath }) => {
  const form = useFormContext();

  return (
    <Box mb="6" data-test="header">
      <Heading display="flex" alignItems="center">
        {children}
        <Button
          onClick={() => {
            form.reset();
            onReset();
          }}
          ml="auto"
          size="sm"
        >
          Reset form
        </Button>
      </Heading>
      {!!githubPath && (
        <Link
          isExternal
          fontSize="sm"
          href={`https://github.com/ivan-dalmet/formiz/tree/master/examples/src/pages/${githubPath}`}
        >
          View code on GitHub
          <Icon as={FiExternalLink} ml="1" />
        </Link>
      )}
    </Box>
  );
};
