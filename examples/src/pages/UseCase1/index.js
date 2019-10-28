import React from 'react';
import { useForm } from '@formiz/core';
import { Heading, Icon } from '@chakra-ui/core';
import { PageHeader } from '../../components/PageHeader';
import { MultiStepsLayout } from '../../components/MultiStepsLayout';
import { General } from './General';
import { DockerImage } from './DockerImage';
import { ExposedPorts } from './ExposedPorts';

export const UseCase1 = () => {
  const form = useForm();

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    form.invalidateFields({
      'docker.image': 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('docker.image');
    form.goToStep(stepWithError);
  };

  return (
    <MultiStepsLayout
      form={form}
      onValidSubmit={handleSubmit}
      submitLabel="Create app"
    >
      <PageHeader>
        UseCase1
      </PageHeader>

      <Heading fontSize="lg" mb={6} mt={12}>
        <Icon name="add" size="0.8rem" mr={2} mb={1} />
        Create a Docker Webapp
      </Heading>

      <DockerImage />
      <ExposedPorts />
      <General />
    </MultiStepsLayout>
  );
};
