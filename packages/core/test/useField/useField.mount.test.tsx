import * as React from 'react';
import { render } from '@testing-library/react';
import { ErrorFieldWithoutForm, ErrorFieldWithoutName } from '../../src/errors';
import { Field, renderUseField, silent } from '../test-utils';

describe('useField: Mount', () => {
  it('Should crash if a field is mounted without `name` property', async () => {
    silent(() => {
      expect(() => {
        render((
          <Field />
        ));
      }).toThrow(ErrorFieldWithoutName);
    });
  });

  it('Should crash if a field is mounted outside of <Formiz> context', async () => {
    silent(() => {
      expect(() => {
        render((
          <Field name="field1" />
        ));
      }).toThrow(ErrorFieldWithoutForm);
    });
  });

  it('Should register the field in the form context', async () => {
    const { formValues } = renderUseField({ name: 'field1' });
    expect(formValues.current).toHaveProperty('field1');
  });

  it('Should unregister the field in the form context', async () => {
    const { formValues, unmount } = renderUseField({ name: 'field1' });
    unmount();
    expect(formValues.current).not.toHaveProperty('field1');
  });
});
