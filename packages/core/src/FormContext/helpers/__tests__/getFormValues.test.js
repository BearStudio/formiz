import { getFormValues } from '../index';

describe('[FormContext:Helper] getFormValues()', () => {
  it('Should get form fields values as an object of fieldName:fieldValue', () => {
    const fields = [
      {
        name: 'fieldA',
        value: 'Value A',
        isEnabled: true,
      },
      {
        name: 'fieldB',
        value: 'Value B',
        isEnabled: true,
      },
      {
        name: 'fieldC',
        value: 'Value C',
        isEnabled: true,
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
        isEnabled: false,
      },
      {
        name: 'fieldB',
        value: 'Value B',
      },
      {
        name: 'fieldC',
        value: 'Value C',
        isEnabled: true,
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
      { name: 'group.subgroup.fieldA', value: 'Value A3', isEnabled: true },
      { name: 'fieldA', value: 'Value A', isEnabled: true },
      { name: 'fieldB', value: 'Value B', isEnabled: true },
      { name: 'group.fieldA', value: 'Value A2', isEnabled: true },
      { name: 'group.fieldB', value: 'Value B2', isEnabled: true },
      { name: 'group.subgroup.fieldB', value: 'Value B3', isEnabled: true },
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

  it('Should get array with [x] syntax', () => {
    const fields = [
      { name: 'array[0]', value: 'Value A', isEnabled: true },
      { name: 'array[1]', value: 'Value B', isEnabled: true },
      { name: 'array[2]', value: 'Value C', isEnabled: true },
      { name: 'collection[0].fieldA', value: 'Value A1', isEnabled: true },
      { name: 'collection[0].fieldB', value: 'Value B1', isEnabled: true },
      { name: 'collection[1].fieldA', value: 'Value A2', isEnabled: true },
      { name: 'collection[1].fieldB', value: 'Value B2', isEnabled: true },
      { name: 'collection[2].group.fieldA', value: 'Value A3', isEnabled: true },
      { name: 'collection[2].group.fieldB', value: 'Value B3', isEnabled: true },
      { name: 'group.array[0].fieldA', value: 'Value A', isEnabled: true },
      { name: 'group.array[1].fieldA', value: 'Value B', isEnabled: true },
    ];

    const values = getFormValues(fields);

    expect(Object.keys(values)).toHaveLength(3);

    expect(values).toMatchObject({
      array: ['Value A', 'Value B', 'Value C'],
      collection: [
        { fieldA: 'Value A1', fieldB: 'Value B1' },
        { fieldA: 'Value A2', fieldB: 'Value B2' },
        {
          group: {
            fieldA: 'Value A3', fieldB: 'Value B3',
          },
        }],
      group: {
        array: [
          { fieldA: 'Value A' },
          { fieldA: 'Value B' },
        ],
      },
    });
  });
});
