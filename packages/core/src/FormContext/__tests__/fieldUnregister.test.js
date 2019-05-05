import { fieldUnregister } from '../actions';

describe('fieldUnregister()', () => {
  it('Should unregister the field without removing it', () => {
    const { fields } = fieldUnregister('myField')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: true,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isActive', false);
    expect(field).toHaveProperty('value', 'my value');
  });

  it('Should unregister the field and removing it', () => {
    const { fields } = fieldUnregister('myField', true)({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: true,
        },
      ],
    });

    expect(fields).toHaveLength(0);
  });

  it('Should not create the field if name does not exist', () => {
    const { fields } = fieldUnregister('myField2')({
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
