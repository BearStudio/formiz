import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Formiz, useRepeater, useForm } from "@formiz/core";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { AddPlaceholder } from "@/components/AddPlaceholder";
import { FieldInput } from "@/components/FieldInput";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { useToastValues } from "@/hooks/useToastValues";

const DEFAULT_VALUES = {
  collection: [
    { name: "Default name (1)" },
    { company: "Default company (2)" },
  ],
};

const INITIAL_VALUES = {
  members: [
    { company: "Initial Company (1)" },
    { name: "Initial Name (2)", company: "Initial Company (2)" },
  ],
};

const Repeater = () => {
  const toastValues = useToastValues();

  const handleSubmit = (values: any) => {
    toastValues(values);
  };

  const form = useForm({
    onValidSubmit: handleSubmit,
    initialValues: INITIAL_VALUES,
  });

  const collection = useRepeater({
    connect: form,
    name: "members",
  });

  return (
    <Formiz connect={form} autoForm>
      <PageLayout>
        <PageHeader githubPath="repeater.tsx">Repeater</PageHeader>
        <Box>
          {collection.keys.map((key, index) => (
            <Stack
              key={key}
              position="relative"
              direction="row"
              spacing="4"
              mb="6"
              data-test={`repeater-item[${index}]`}
            >
              <Box transform="translateY(4rem)">
                <IconButton
                  aria-label="Add"
                  icon={<Icon as={FiPlus} />}
                  size="sm"
                  onClick={() => collection.insert(index + 1)}
                  variant="ghost"
                  isDisabled={collection.length > 20}
                  pointerEvents={
                    index + 1 >= collection.length ? "none" : undefined
                  }
                  opacity={index + 1 >= collection.length ? 0 : undefined}
                />
              </Box>
              <Box flex="1">
                <FieldInput
                  name={`members[${index}].name`}
                  defaultValue={DEFAULT_VALUES.collection[index]?.name}
                  label="Name"
                  required="Required"
                  m="0"
                />
              </Box>
              <Box flex="1">
                <FieldInput
                  name={`members[${index}].company`}
                  defaultValue={DEFAULT_VALUES.collection[index]?.company}
                  label="Company"
                  m="0"
                />
              </Box>
              <Box pt="8">
                <IconButton
                  aria-label="Delete"
                  icon={<Icon as={FiTrash2} />}
                  onClick={() => collection.remove(index)}
                  variant="ghost"
                />
              </Box>
              <Box
                position="absolute"
                top={0}
                right={0}
                fontSize="xs"
                color="gray.400"
              >
                key: {key}
              </Box>
            </Stack>
          ))}
        </Box>

        {collection.length <= 20 && (
          <AddPlaceholder
            label="Add member"
            onClick={() => collection.append()}
          />
        )}

        <Wrap>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.insert(4, { name: "Name (5)" });
              }}
            >
              Add 1 member at index 4
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.insert(-2, {
                  name: `Name (${Math.max(0, collection.length - 2)})`,
                });
              }}
            >
              Add 1 member at index -2
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.insertMultiple(1, [
                  { name: "Name (2)" },
                  { name: "Name (3)" },
                  { name: "Name (4)" },
                ]);
              }}
            >
              Add 3 members at index 1
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.remove(1);
              }}
            >
              Remove member at index 1
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.remove(-2);
              }}
            >
              Remove member at index -2
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.removeMultiple([1, 3, 4]);
              }}
            >
              Remove members at index 1, 3 & 4
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              size="sm"
              onClick={() => {
                collection.set([
                  { name: "Name (1)", company: null },
                  { name: "Name (2)", company: null },
                  { name: "Name (3)", company: null },
                ]);
              }}
            >
              Set collection to 3 members
            </Button>
          </WrapItem>
        </Wrap>

        <Flex mt="4">
          <Button
            type="submit"
            ml="auto"
            isDisabled={!form.isValid && form.isSubmitted}
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};

export default Repeater;
