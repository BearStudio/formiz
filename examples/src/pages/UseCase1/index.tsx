import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Heading } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { PageHeader } from '../../components/PageHeader';
import { MultiStepsLayout } from '../../components/MultiStepsLayout';
import { General } from './General';
import { DockerImage } from './DockerImage';
import { ExposedPorts } from './ExposedPorts';
import { useToastValues } from '../../hooks/useToastValues';

export const UseCase1 = () => {
  const form = useForm({ subscribe: false });
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);
    form.invalidateFields({
      'docker.image': 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('docker.image');
    if (stepWithError) {
      form.goToStep(stepWithError);
    }
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit}>
      <MultiStepsLayout submitLabel="Create app">
        <PageHeader githubPath="UseCase1/index.js">Real life #1</PageHeader>

        <Heading fontSize="lg" mb={6} mt={12}>
          <AddIcon size="0.8rem" mr={2} mb={1} />
          Create a Docker Webapp
        </Heading>

        <DockerImage />
        <ExposedPorts />
        <General />
      </MultiStepsLayout>
    </Formiz>
  );
};
