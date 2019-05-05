import { fieldSetValue } from '../actions';

describe('fieldSetValue()', () => {
  it('Should update the value', () => {
    const { fields } = fieldSetValue('myField', 'new value')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: true,
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
          isActive: true,
        },
      ],
    });

    expect(fields).toHaveLength(1);
  });
});
