import React from 'react';
import { mount } from 'enzyme';
import { Input } from './utils';
import { Formiz } from '../src';

beforeEach(() => {
  jest.resetModules();
});

describe('<Formiz />', () => {
  it('Should mount without crashing', () => {
    mount(
      <Formiz>
        My Form
      </Formiz>
    );
  });

  it('Should mount fields without crashing', () => {
    mount(
      <Formiz>
        <Input name="field" />
        <Input name="field2" />
      </Formiz>
    );
  });

  it('Should mount 2 separated `<Formiz>` without crashing', () => {
    mount(
      <div>
        <Formiz>
          <Input name="field" />
          <Input name="field2" />
        </Formiz>
        <Formiz>
          <Input name="field" />
          <Input name="field2" />
        </Formiz>
      </div>
    );
  });
});
