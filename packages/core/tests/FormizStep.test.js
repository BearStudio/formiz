import React from 'react';
import { mount } from 'enzyme';
import { Input, silent, wait } from './utils';
import { Formiz, FormizStep } from '../src';
import { ErrorStepWithoutName } from '../src/FormStepContext/errors';

beforeEach(() => {
  jest.resetModules();
});

describe('<FormizStep />', () => {
  it('Should mount without crashing', () => {
    mount(
      <Formiz autoForm>
        <FormizStep name="step1">
          Form Step 1
        </FormizStep>
      </Formiz>,
    );
  });

  it('Should crash if mounted without `name` property', () => {
    silent(() => {
      expect(() => {
        mount(
          <Formiz autoForm>
            <FormizStep>
              Form Step
            </FormizStep>
            <FormizStep>
              Form Step
            </FormizStep>
          </Formiz>,
        );
      }).toThrow(ErrorStepWithoutName);
    });
  });

  it('Should mount fields without crashing', () => {
    mount(
      <Formiz autoForm>
        <FormizStep name="step1">
          <Input name="field" />
          <Input name="field2" />
        </FormizStep>
      </Formiz>,
    );
  });

  it('Should mount 2 `<FormizStep>` without crashing', () => {
    mount(
      <div>
        <Formiz autoForm>
          <FormizStep name="step1">
            <Input name="field" />
            <Input name="field2" />
          </FormizStep>
          <FormizStep name="step2">
            <Input name="field3" />
            <Input name="field4" />
          </FormizStep>
        </Formiz>
      </div>,
    );
  });

  it('Should register fields in steps', async () => {
    let formValues = null;
    const mockSubmit = jest.fn((values) => { formValues = values; });

    const form = mount(
      <Formiz onSubmit={mockSubmit} autoForm>
        <FormizStep name="step1">
          <Input name="field" />
          <Input name="field2" />
        </FormizStep>
        <FormizStep name="step2">
          <Input name="field3" />
          <Input name="field4" />
        </FormizStep>
      </Formiz>,
    );

    await wait();

    form.simulate('submit');
    expect(formValues).toHaveProperty('field');
    expect(formValues).toHaveProperty('field2');
    expect(formValues).toHaveProperty('field3');
    expect(formValues).toHaveProperty('field4');
  });
});
