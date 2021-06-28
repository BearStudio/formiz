import React from 'react';
import { useField } from '@formiz/core';
import { chakra } from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { FormGroup } from '../FormGroup';

export const FieldUpload = (props) => {
  const {
    errorMessage,
    id,
    isValid,
    isSubmitted,
    setValue,
    value,
    otherProps,
  } = useField(props);
  const { required, name } = props;
  const {
    children, label, type, placeholder, helper, ...rest
  } = otherProps;
  const showError = !isValid && isSubmitted;

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired: !!required,
    label,
    showError,
    name,
    ...rest,
  };

  const handleChange = ({ target }) => {
    const file = target.files[0];

    if (!file) {
      setValue(null);
      return;
    }

    setValue({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      file,
    });
  };

  return (
    <FormGroup {...formGroupProps}>
      <chakra.label
        position="relative"
        bg="gray.50"
        d="flex"
        alignItems="center"
        px="4"
        py="2"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        color="gray.600"
        transition="0.2s"
        _hover={{
          bg: 'brand.50',
          borderColor: 'brand.600',
        }}
        _focusWithin={{
          bg: 'brand.50',
          borderColor: 'brand.600',
        }}
      >
        <chakra.input
          opacity={0}
          position="absolute"
          top={0}
          left={0}
          width={0}
          type="file"
          id={id}
          onChange={handleChange}
        />
        <AttachmentIcon mr="2" /> {value?.name || 'Select file'}
      </chakra.label>
    </FormGroup>
  );
};
