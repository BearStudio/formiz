import React, { useState, useEffect } from "react";
import { FormizStep, useFormContext } from "@formiz/core";
import { Checkbox, Link, Code, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { FieldInput } from "@/components/FieldInput";
import { FieldSelect } from "@/components/FieldSelect";

export const DockerImage = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const form = useFormContext();

  useEffect(() => {
    setIsPrivate(false);
  }, [form.resetKey]);

  return (
    <FormizStep name="dockerImage">
      <FieldInput
        name="docker.image"
        label="Docker Image"
        required="Required"
        helper={
          <>
            Use{" "}
            <Link
              href="https://hub.docker.com"
              color="brand.600"
              fontWeight="bold"
              isExternal
            >
              Docker hub
              <Icon as={FiExternalLink} mx="1" fontSize="sm" />
            </Link>{" "}
            image like <Code>ubuntu</Code> or{" "}
            <Code>bearstudio/design-system</Code>
          </>
        }
      />

      <Checkbox
        my={6}
        isChecked={isPrivate}
        onChange={() => setIsPrivate((x) => !x)}
      >
        Private image
      </Checkbox>

      {isPrivate && (
        <FieldSelect
          name="docker.user"
          label="Docker User Credentials"
          placeholder="Select user..."
          required="Required"
          // keepValue
          options={[
            { value: "admin", label: "Admin" },
            { value: "demo", label: "Demo" },
          ]}
        />
      )}
    </FormizStep>
  );
};
