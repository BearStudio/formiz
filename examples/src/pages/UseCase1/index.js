import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Heading, Icon } from '@chakra-ui/core';
import { PageHeader } from '../../components/PageHeader';
import { MultiStepsLayout } from '../../components/MultiStepsLayout';
import { General } from './General';
import { DockerImage } from './DockerImage';
import { ExposedPorts } from './ExposedPorts';
import { useToastValues } from '../../hooks/useToastValues';

export const UseCase1 = () => {
  const form = useForm({ stateLevel: 'none' });
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);
    form.invalidateFields({
      'docker.image': 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('docker.image');
    form.goToStep(stepWithError);
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit}>
      <MultiStepsLayout
        submitLabel="Create app"
      >
        <PageHeader githubPath="UseCase1/index.js">
          Real life #1
        </PageHeader>

        <Heading fontSize="lg" mb={6} mt={12}>
          <Icon name="add" size="0.8rem" mr={2} mb={1} />
          Create a Docker Webapp
        </Heading>

        <DockerImage />
        <ExposedPorts />
        <General />
      </MultiStepsLayout>
    </Formiz>
  );
};
