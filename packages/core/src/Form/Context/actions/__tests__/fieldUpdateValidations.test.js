import { fieldUpdateValidations } from '../index';

describe('[FormContext:Action] fieldUpdateValidations()', () => {
  it('Should update the field with new validations', () => {
    const validations = [
      {
        rule: x => !!x,
      },
    ];

    const { fields } = fieldUpdateValidations('myField', validations)({
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

    expect(field).toHaveProperty('isActive', true);
    expect(field).toHaveProperty('value', 'my value');
    expect(field).toHaveProperty('validations', validations);
  });

  it('Should not modify the state if the field does not exist', () => {
    const validations = [
      {
        rule: x => !!x,
      },
    ];

    const prevFields = [
      {
        name: 'myField',
        value: 'my value',
        isActive: true,
      },
    ];

    const { fields } = fieldUpdateValidations('myFieldNotExist', validations)({
      fields: prevFields,
    });

    expect(fields).toHaveLength(1);
    expect(fields).toBe(prevFields);
  });
});
