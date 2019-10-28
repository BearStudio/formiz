import React from 'react';
import { FormizStep } from '@formiz/core';
import { FieldInput } from '../../components/Fields/FieldInput';
import { FieldTextarea } from '../../components/Fields/FieldTextarea';

export const General = () => (
  <FormizStep name="step1">
    <FieldInput
      name="name"
      label="App Name"
      isRequired="Required"
    />
    <FieldTextarea
      name="description"
      label="App Description"
    />
  </FormizStep>
);
