import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Formiz, useCollection, useForm, useFormContext } from "@formiz/core";
import { FiEye, FiEyeOff, FiPlus, FiTrash2 } from "react-icons/fi";
import { AddPlaceholder } from "@/components/AddPlaceholder";
import { FieldInput } from "@/components/FieldInput";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { useToastValues } from "@/hooks/useToastValues";
import { useState } from "react";

const DEFAULT_VALUES = {
  members: [{ name: "Default name (1)" }, { company: "Default company (2)" }],
};
const INITIAL_VALUES = {
  members: [
    { company: "Initial Company (1)" },
    { name: "Initial Name (2)", company: "Initial Company (2)" },
  ],
  conditioned: ["Initial value (1)", "Initial value (2)"],
};

type FormValues = any;

const Collection = () => {
  const toastValues = useToastValues();

  const form = useForm<FormValues>({
    initialValues: INITIAL_VALUES,
    onValidSubmit: (values) => {
      toastValues(values);
    },
  });

  const collection = useCollection("members", {
    connect: form,
  });

  const [isConditionedCollectionDisplay, setIsConditionedCollectionDisplay] =
    useState(false);

  return (
    <Formiz connect={form} autoForm>
      <PageLayout>
        <PageHeader githubPath="collection.tsx">Collection</PageHeader>
        <Box>
          {collection.keys.map((key, index) => (
            <Stack
              key={key}
              position="relative"
              direction="row"
              spacing="4"
              mb="6"
              data-test={`collection-item[${index}]`}
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
                  defaultValue={DEFAULT_VALUES.members[index]?.name}
                  label="Name"
                  required="Required"
                  m="0"
                />
              </Box>
              <Box flex="1">
                <FieldInput
                  name={`members[${index}].company`}
                  defaultValue={DEFAULT_VALUES.members[index]?.company}
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
                collection.set([{ name: "Name (1)" }], { keepPristine: true });
              }}
            >
              Set collection to 1 membre, with keepPristine
            </Button>
          </WrapItem>
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

        <Stack mt={10}>
          <Stack spacing={0}>
            <Text fontWeight="medium">Conditioned collection</Text>
            <Text fontSize="xs" color="gray.500">
              This show that an unmount collection is unregister, then the
              collection keys are reset on remount
            </Text>
          </Stack>
          <HStack
            spacing={6}
            alignItems="start"
            p={6}
            borderRadius="md"
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
          >
            <Stack spacing={0} flex={1}>
              <Button
                w="fit-content"
                leftIcon={
                  isConditionedCollectionDisplay ? <FiEyeOff /> : <FiEye />
                }
                onClick={() =>
                  setIsConditionedCollectionDisplay(
                    !isConditionedCollectionDisplay
                  )
                }
              >
                {isConditionedCollectionDisplay ? "Hide" : "Display"}
              </Button>
            </Stack>
            <Flex flex={2}>
              {isConditionedCollectionDisplay && <ConditionedCollection />}
            </Flex>
          </HStack>
        </Stack>

        <Stack mt={10}>
          <Stack spacing={0}>
            <Text fontWeight="medium">Nested collections</Text>
            <Text fontSize="xs" color="gray.500">
              This show that an unmount collection is unregister, then the
              collection keys are reset on remount
            </Text>
          </Stack>
          <NestedCollections />
        </Stack>

        <Stack mt={10}>
          <Stack spacing={0}>
            <Text fontWeight="medium">Managed from form</Text>
            <Text fontSize="xs" color="gray.500">
              This show that we can update collection even if we don&apos;t have
              direct access to the collection definition
            </Text>
          </Stack>
          <ManagedFromForm />
        </Stack>

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

const ConditionedCollection = () => {
  const conditionedCollection = useCollection("conditioned", {
    defaultValue: ["Default value"],
  });

  return (
    <Stack flex={1}>
      {conditionedCollection.keys.map((key, index) => (
        <HStack key={key} alignItems="end">
          <FieldInput
            name={`conditioned[${index}]`}
            label={`Conditioned ${index}`}
          />
          <IconButton
            aria-label="Delete"
            icon={<Icon as={FiTrash2} />}
            onClick={() => conditionedCollection.remove(index)}
            variant="ghost"
          />
        </HStack>
      ))}
      <AddPlaceholder
        onClick={() => conditionedCollection.append()}
        label="Add item"
        my={2}
      />
    </Stack>
  );
};

const NestedCollections = () => {
  const parentCollection = useCollection("parent");

  return (
    <Stack flex={1}>
      {parentCollection.keys.map((key, index) => (
        <HStack key={key} alignItems="start" p={4}>
          <Stack flex={1}>
            <FieldInput
              name={`parent[${index}].name`}
              label={`Parent ${index}`}
            />
            <Stack pl={20}>
              <Text fontWeight="bold" fontSize="sm">
                Children
              </Text>
              <NestedCollectionsChild name={`parent[${index}].children`} />
            </Stack>
          </Stack>
          <IconButton
            aria-label="Delete"
            icon={<Icon as={FiTrash2} />}
            onClick={() => parentCollection.remove(index)}
          />
        </HStack>
      ))}
      <AddPlaceholder
        onClick={() => parentCollection.append()}
        label="Add parent"
        my={2}
      />
    </Stack>
  );
};

const NestedCollectionsChild = (props: { name: string }) => {
  const childCollection = useCollection(props.name);

  return (
    <Stack flex={1}>
      {childCollection.keys.map((key, index) => (
        <HStack key={key} alignItems="end">
          <FieldInput
            name={`${props.name}[${index}]`}
            label={`Child ${index}`}
          />
          <IconButton
            aria-label="Delete"
            icon={<Icon as={FiTrash2} />}
            onClick={() => childCollection.remove(index)}
            variant="outline"
          />
        </HStack>
      ))}
      <AddPlaceholder
        onClick={() => childCollection.append()}
        label="Add child"
        my={0}
      />
    </Stack>
  );
};

const ManagedFromForm = () => {
  const form = useFormContext();
  const collection = form.collection("items");

  return (
    <Stack>
      <ButtonGroup size="sm">
        <Button onClick={() => collection?.prepend("new first value")}>
          Prepend
        </Button>
        <Button onClick={() => collection?.append("new last value")}>
          Append
        </Button>
        <Button onClick={() => collection?.remove(0)}>Remove first item</Button>
        <Button onClick={() => collection?.set(["one", "two", "three"])}>
          Set 3 items
        </Button>
      </ButtonGroup>
      <Stack
        flex={1}
        p={4}
        border="dashed 1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.600" }}
        borderRadius="md"
      >
        <Text>Collection is defined here</Text>
        <NestedCollectionsChild name="items" />
      </Stack>
    </Stack>
  );
};

export default Collection;
