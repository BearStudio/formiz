import { getFormValues } from '../index';

describe('[FormContext:Helper] getFormValues()', () => {
  it('Should get form fields values as an object of fieldName:fieldValue', () => {
    const fields = [
      {
        name: 'fieldA',
        value: 'Value A',
        isActive: true,
      },
      {
        name: 'fieldB',
        value: 'Value B',
        isActive: true,
      },
      {
        name: 'fieldC',
        value: 'Value C',
        isActive: true,
      },
    ];

    const values = getFormValues(fields);

    expect(Object.keys(values)).toHaveLength(3);
    expect(values).toHaveProperty('fieldA', 'Value A');
    expect(values).toHaveProperty('fieldB', 'Value B');
    expect(values).toHaveProperty('fieldC', 'Value C');
  });

  it('Should not get values for not active fields', () => {
    const fields = [
      {
        name: 'fieldA',
        value: 'Value A',
        isActive: false,
      },
      {
        name: 'fieldB',
        value: 'Value B',
      },
      {
        name: 'fieldC',
        value: 'Value C',
        isActive: true,
      },
    ];

    const values = getFormValues(fields);

    expect(Object.keys(values)).toHaveLength(1);
    expect(values).toHaveProperty('fieldC', 'Value C');
  });
});
