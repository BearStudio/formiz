import React, { useState, useEffect } from 'react';
import { FormizStep, useForm } from '@formiz/core';
import {
  Checkbox, Link, Icon, Code,
} from '@chakra-ui/core';
import { FieldInput } from '../../components/Fields/FieldInput';
import { FieldSelect } from '../../components/Fields/FieldSelect';

export const DockerImage = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const form = useForm();

  useEffect(() => {
    setIsPrivate(false);
  }, [form.resetKey]);

  return (
    <FormizStep name="dockerImage">
      <FieldInput
        name="docker.image"
        label="Docker Image"
        required="Required"
        helper={(
          <>
            Use
            {' '}
            <Link href="https://hub.docker.com" color="brand.600" fontWeight="bold" isExternal>
              Docker hub
              <Icon name="external-link" mx="1" mb="1" />
            </Link>
            {' '}
            image like
            {' '}
            <Code variantColor="brand">ubuntu</Code>
            {' '}
            or
            {' '}
            <Code variantColor="brand">saagie/design-system</Code>
          </>
        )}
      />

      <Checkbox
        mb={6}
        variantColor="brand"
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
          keepValue
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'demo', label: 'Demo' },
          ]}
        />
      )}
    </FormizStep>
  );
};
