import React, { useState, useEffect } from 'react';
import { FormizStep, useForm } from '@formiz/core';
import { Checkbox, Link, Code } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FieldInput } from '../../components/Fields/FieldInput';
import { FieldSelect } from '../../components/Fields/FieldSelect';

export const DockerImage = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const form = useForm({ subscribe: 'form' });

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
            Use{' '}
            <Link
              href="https://hub.docker.com"
              color="brand.600"
              fontWeight="bold"
              isExternal
            >
              Docker hub
              <ExternalLinkIcon mx="1" mb="1" />
            </Link>{' '}
            image like <Code colorScheme="brand">ubuntu</Code> or{' '}
            <Code colorScheme="brand">saagie/design-system</Code>
          </>
        )}
      />

      <Checkbox
        mb={6}
        colorScheme="brand"
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
