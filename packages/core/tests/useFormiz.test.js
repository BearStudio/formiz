/* eslint-disable react/prop-types */
import React from 'react';
import { mount } from 'enzyme';
import { silent, Input } from './utils';
import { Formiz } from '../src';
import { FormContextProvider } from '../src/Form/Context';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from '../src/useField/errors';

describe('Fields using `useFormiz()`', () => {
  it('Should crash if field is mount outside of `<FormContextProvider>`', () => {
    silent(() => {
      expect(() => {
        mount(
          <Input name="field" />
        );
      }).toThrow(ErrorFieldWithoutForm);
    });
  });

  it('Should crash if field is mounted without `name` property', () => {
    silent(() => {
      expect(() => {
        mount(
          <Formiz>
            <Input />
          </Formiz>
        );
      }).toThrow(ErrorFieldWithoutName);
    });
  });

  it('Should mount fields & register them', () => {
    let fields;

    const onStateChange = (state) => {
      ({ fields } = state);
    };

    mount(
      <FormContextProvider onStateChange={onStateChange}>
        <Input name="field1" />
        <Input name="field2" />
      </FormContextProvider>
    );

    expect(fields).toHaveLength(2);

    expect(fields[0].name).toBe('field1');
    expect(fields[0].value).toBeNull();

    expect(fields[1].name).toBe('field2');
    expect(fields[1].value).toBeNull();
  });

  it('Should not register not mounted fields', () => {
    let fields;

    const onStateChange = (state) => {
      ({ fields } = state);
    };

    mount(
      <FormContextProvider onStateChange={onStateChange}>
        {false && (
          <Input name="field1" />
        )}
      </FormContextProvider>
    );

    expect(fields).toHaveLength(0);
  });

  it('Should register field with value if defaultValue provided', () => {
    let fields;

    const onStateChange = (state) => {
      ({ fields } = state);
    };

    mount(
      <FormContextProvider onStateChange={onStateChange}>
        <Input name="field1" defaultValue="Default value" />
      </FormContextProvider>
    );

    expect(fields).toHaveLength(1);
    expect(fields.find(x => x.name === 'field1').value).toBe('Default value');
  });

  it('Should update the value if input change', () => {
    let fields;

    const onStateChange = (state) => {
      ({ fields } = state);
    };

    const component = mount(
      <FormContextProvider onStateChange={onStateChange}>
        <Input name="field1" defaultValue="Default value" />
      </FormContextProvider>
    );

    const input = component.find('input').first();
    input.simulate('change', { target: { value: 'New value' } });

    component.setProps(); // Trigger update

    const field = fields.find(x => x.name === 'field1');
    expect(field).toHaveProperty('value', 'New value');
  });

  it('Should register new field and keep current registred field value', () => {
    let fields;

    const onStateChange = (state) => {
      ({ fields } = state);
    };

    const Component = ({ isVisible }) => (
      <FormContextProvider onStateChange={onStateChange}>
        <Input name="field1" />
        {isVisible && (
          <Input name="field2" />
        )}
      </FormContextProvider>
    );

    const component = mount(<Component />);

    const input1 = component.find('input').first();
    input1.simulate('change', { target: { value: 'New value' } });

    component.setProps({ isVisible: true });

    expect(fields).toHaveLength(2);

    const field1 = fields.find(x => x.name === 'field1');
    expect(field1).toHaveProperty('value', 'New value');
  });
});
