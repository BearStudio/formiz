import { fieldUpdateValidations } from '../index';

describe('[FormContext:Action] fieldUpdateValidations()', () => {
  it('Should update the field with new validations', () => {
    const validations = [
      {
        rule: x => !!x,
      },
    ];

    const { fields } = fieldUpdateValidations(1, validations)({
      fields: [
        {
          id: 1,
          name: 'myField',
          value: 'my value',
          isEnabled: true,
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('isEnabled', true);
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
        id: 1,
        name: 'myField',
        value: 'my value',
        isEnabled: true,
      },
    ];

    const { fields } = fieldUpdateValidations(2, validations)({
      fields: prevFields,
    });

    expect(fields).toHaveLength(1);
    expect(fields).toBe(prevFields);
  });
});
