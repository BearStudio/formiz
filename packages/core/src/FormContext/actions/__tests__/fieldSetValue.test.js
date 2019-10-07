import { fieldSetValue } from '../index';

describe('[FormContext:Action] fieldSetValue()', () => {
  it('Should update the value', () => {
    const { fields } = fieldSetValue('myField', 'new value')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isEnabled: true,
        },
      ],
    });

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('value', 'new value');
  });

  it('Should not create the field if name does not exist', () => {
    const { fields } = fieldSetValue('myField2', 'new value')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isEnabled: true,
        },
      ],
    });

    expect(fields).toHaveLength(1);
  });

  it('fieldSetValue should remove the external error on the given field', () => {
    const { fields } = fieldSetValue('myField2', 'new value')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isEnabled: true,
          externalError: 'External error',
        },
        {
          name: 'myField2',
          value: 'my value',
          isEnabled: true,
          externalError: 'External error',
        },
      ],
    });

    expect(fields[0]).toHaveProperty('externalError', 'External error');
    expect(fields[1]).not.toHaveProperty('externalError');
  });
});
