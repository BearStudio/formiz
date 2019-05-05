import { fieldValidate } from '../actions';

describe('fieldValidate()', () => {
  it('Should auto validate the field if no validations provided', () => {
    const { fields } = fieldValidate('myField')({
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

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(0);
  });

  it('Should validate the field has value and isRequired provided', () => {
    const isRequired = x => !!x;
    const { fields } = fieldValidate('myField')({
      fields: [
        {
          name: 'myField',
          value: 'my value',
          isActive: true,
          validations: [
            {
              rule: isRequired,
            },
          ],
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(0);
  });

  it('Should not validate the field if 1 validation is false', () => {
    const { fields } = fieldValidate('myField')({
      fields: [
        {
          name: 'myField',
          value: '',
          isActive: true,
          validations: [
            {
              rule: x => !!x,
            },
          ],
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(1);
  });

  it('Should not validate the field if all validations are false', () => {
    const { fields } = fieldValidate('myField')({
      fields: [
        {
          name: 'myField',
          value: '',
          isActive: true,
          validations: [
            {
              rule: x => !!x,
            },
            {
              rule: x => x === 2,
            },
            {
              rule: x => x === 3,
            },
          ],
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(3);
  });

  it('Should not validate the field if 1 validation of all is false', () => {
    const { fields } = fieldValidate('myField')({
      fields: [
        {
          name: 'myField',
          value: '',
          isActive: true,
          validations: [
            {
              rule: x => !!x,
            },
            {
              rule: x => x !== 2,
            },
            {
              rule: x => x !== 3,
            },
          ],
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(1);
  });

  it('Should validate the field if all validations are true', () => {
    const { fields } = fieldValidate('myField')({
      fields: [
        {
          name: 'myField',
          value: 1,
          isActive: true,
          validations: [
            {
              rule: x => !!x,
            },
            {
              rule: x => x !== 2,
            },
            {
              rule: x => x !== 3,
            },
          ],
        },
      ],
    });

    expect(fields).toHaveLength(1);

    const field = fields.find(x => x.name === 'myField');

    expect(field).toHaveProperty('errors');
    expect(field.errors).toHaveLength(0);
  });
});
