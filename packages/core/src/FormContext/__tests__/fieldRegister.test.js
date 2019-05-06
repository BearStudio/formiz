import { fieldRegister } from '../actions';

describe('fieldRegister()', () => {
  it('Should register the field without value if no defaultValue', () => {
    const { fields } = fieldRegister('myField')({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isActive', true);
    expect(field).toHaveProperty('value', null);
    expect(field).toHaveProperty('validations', []);
  });

  it('Should register the field with value if defaultValue provided', () => {
    const { fields } = fieldRegister('myField', 'myValue')({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isActive', true);
    expect(field).toHaveProperty('value', 'myValue');
    expect(field).toHaveProperty('validations', []);
  });

  it('Should not replace the value with defaultValue if registred again', () => {
    const { fields } = fieldRegister('myField', 'default value')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: false,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isActive', true);
    expect(field).toHaveProperty('value', 'my value');
  });

  it('Should register validations in the field state', () => {
    const { fields } = fieldRegister('myField', null, [
      {
        rule: x => !!x,
      },
    ])({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: false,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isActive', true);
    expect(field).toHaveProperty('value', 'my value');
    expect(field).toHaveProperty('validations');
    expect(field.validations).toHaveLength(1);
  });
});
