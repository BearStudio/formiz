import { fieldUnregister } from '../index';

describe('[FormContext:Action] fieldUnregister()', () => {
  it('Should remove the field from the state', () => {
    const { fields } = fieldUnregister('myField')({
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

  it('Should keep the field in the state if isKeepValue is true', () => {
    const { fields } = fieldUnregister('myField', true)({
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
});
