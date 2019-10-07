import { fieldRegister } from '../index';

describe('[FormContext:Action] fieldRegister()', () => {
  it('Should register the field without value if no defaultValue', () => {
    const { fields } = fieldRegister('myField')({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('value', null);
    expect(field).toHaveProperty('step', null);
    expect(field).toHaveProperty('validations', []);
  });

  it('Should register the field with value if defaultValue provided', () => {
    const { fields } = fieldRegister('myField', { value: 'myValue' })({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('value', 'myValue');
    expect(field).toHaveProperty('step', null);
    expect(field).toHaveProperty('validations', []);
  });

  it('Should not replace the value with defaultValue if registred again', () => {
    const { fields } = fieldRegister('myField', { value: 'default value' })({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isEnabled: false,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('value', 'my value');
  });

  it('Should register with the step name if one is provided', () => {
    const { fields } = fieldRegister('myField', { step: 'myStep' })({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('step', 'myStep');
  });

  it('Should not register with the step name if none is provided', () => {
    const { fields } = fieldRegister('myField')({
      fields: [],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('step', null);
  });

  it('Should register validations in the field state', () => {
    const { fields } = fieldRegister('myField', {
      validations: [
        {
          rule: x => !!x,
        },
      ],
    })({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isEnabled: false,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
    expect(field).toHaveProperty('value', 'my value');
    expect(field).toHaveProperty('step', null);
    expect(field).toHaveProperty('validations');
    expect(field.validations).toHaveLength(1);
  });
});
