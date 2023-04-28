import React from "react";
import { FormizStep, useFormFields, useCollection } from "@formiz/core";
import { IconButton, Box, Stack, Icon, Button } from "@chakra-ui/react";
import { FieldInput } from "@/components/FieldInput";
import { FiTrash } from "react-icons/fi";
import { AddPlaceholder } from "@/components/AddPlaceholder";

export const ExposedPorts = () => {
  const values = useFormFields({
    fields: ["ports"],
    selector: (field) => field.value,
  });
  const exposedPorts = useCollection({
    name: "ports",
  });

  return (
    <FormizStep name="exposedPorts">
      {exposedPorts.keys.map((key, index) => (
        <Stack
          key={key}
          direction="row"
          spacing="4"
          mb="6"
          bgColor="gray.50"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          _dark={{ bgColor: "gray.700", borderColor: "gray.900" }}
          p="4"
        >
          <Box flex="1">
            <FieldInput
              name={`ports[${index}].number`}
              label="Port number"
              required="Required"
              placeholder="e.g. 8080"
              type="number"
              m="0"
              validations={[
                {
                  handler: (val) =>
                    (values.ports || []).filter(
                      (x: { number: string }) => x.number === val
                    ).length <= 1,
                  deps: [JSON.stringify(values.ports)],
                  message: "Must be unique",
                },
              ]}
            />
          </Box>
          <Box flex="1">
            <FieldInput
              name={`ports[${index}].name`}
              label="Port name"
              placeholder="e.g. webapp"
              m="0"
            />
          </Box>
          <Box pt="1.75rem">
            <IconButton
              aria-label="Delete port"
              icon={<Icon as={FiTrash} />}
              onClick={() => exposedPorts.remove(index)}
              variant="ghost"
            />
          </Box>
        </Stack>
      ))}
      {exposedPorts.length <= 20 && (
        <AddPlaceholder
          label="Add port"
          onClick={() => exposedPorts.append()}
        />
      )}
    </FormizStep>
  );
};
