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

  it('Should get an empty array if not fields available', () => {
    const fields = [];
    const values = getFormValues(fields);
    expect(values).toMatchObject({});
  });

  it('Should get object with dot syntax', () => {
    const fields = [
      { name: 'group.subgroup.fieldA', value: 'Value A3', isActive: true },
      { name: 'fieldA', value: 'Value A', isActive: true },
      { name: 'fieldB', value: 'Value B', isActive: true },
      { name: 'group.fieldA', value: 'Value A2', isActive: true },
      { name: 'group.fieldB', value: 'Value B2', isActive: true },
      { name: 'group.subgroup.fieldB', value: 'Value B3', isActive: true },
    ];

    const values = getFormValues(fields);

    expect(Object.keys(values)).toHaveLength(3);
    expect(Object.keys(values.group)).toHaveLength(3);
    expect(Object.keys(values.group.subgroup)).toHaveLength(2);
    expect(values).toHaveProperty('fieldA', 'Value A');
    expect(values).toHaveProperty('fieldB', 'Value B');
    expect(values).toHaveProperty('group.fieldA', 'Value A2');
    expect(values).toHaveProperty('group.fieldB', 'Value B2');
    expect(values).toHaveProperty('group.subgroup.fieldA', 'Value A3');
    expect(values).toHaveProperty('group.subgroup.fieldB', 'Value B3');
  });
});
