import React from 'react';
import { mount } from 'enzyme';
import { silent, Input } from './utils';
import { Formiz } from '../src';
import { FormContextProvider } from '../src/FormContextProvider';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from '../src/errors';

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

    expect(fields.length).toBe(2);

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

    expect(fields.length).toBe(0);
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

    expect(fields.length).toBe(1);
    expect(fields.find(x => x.name === 'field1').value).toBe('Default value');
  });
});
