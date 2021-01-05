import * as React from 'react';
import { render } from '@testing-library/react';
import { FormizStep } from '../src/index';
import { ErrorStepWithoutName, ErrorStepWithoutForm } from '../src/errors';
import { silent } from './test-utils';

describe('<FormizStep />', () => {
  it('Should crash if a <FormizStep> is mounted without `name` property', async () => {
    silent(() => {
      expect(() => {
        render((
          <FormizStep name="" />
        ));
      }).toThrow(ErrorStepWithoutName);
    });
  });

  it('Should crash if a <FormizStep> is mounted outside of <Formiz> context', async () => {
    silent(() => {
      expect(() => {
        render((
          <FormizStep name="step1" />
        ));
      }).toThrow(ErrorStepWithoutForm);
    });
  });
});
