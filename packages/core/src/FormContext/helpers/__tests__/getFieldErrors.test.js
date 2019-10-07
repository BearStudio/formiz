import { getFieldErrors } from '../index';

const isRequired = () => x => !!x;
const isEqual = match => x => x === match;

describe('[FormContext:Helper] getFieldErrors()', () => {
  it('Should not return errors if no validations', () => {
    const field = {
      name: 'myField',
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(0);
  });

  it('Should not return errors if all validation are true', () => {
    const field = {
      name: 'myField',
      value: 'my value',
      isEnabled: true,
      validations: [
        {
          rule: isRequired(),
        },
        {
          rule: isEqual('my value'),
        },
      ],
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(0);
  });

  it('Should return an error if one validation is false', () => {
    const field = {
      name: 'myField',
      value: 'not my value',
      isEnabled: true,
      validations: [
        {
          rule: isRequired(),
        },
        {
          rule: isEqual('my value'),
        },
      ],
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(1);
  });

  it('Should return multiple errors if multiple validations are false', () => {
    const field = {
      name: 'myField',
      value: '',
      isEnabled: true,
      validations: [
        {
          rule: x => !!x,
        },
        {
          rule: isEqual('my value'),
        },
      ],
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(2);
  });

  it('Should return an error with message if one validation is false', () => {
    const field = {
      name: 'myField',
      value: 'not my value',
      isEnabled: true,
      validations: [
        {
          rule: isRequired(),
          message: 'Field is required',
        },
        {
          rule: isEqual('my value'),
          message: 'Field should be "my value"',
        },
      ],
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBe('Field should be "my value"');
  });

  it('Should return multiple errors if multiple validations are false', () => {
    const field = {
      name: 'myField',
      value: '',
      isEnabled: true,
      validations: [
        {
          rule: isRequired(),
          message: 'Field is required',
        },
        {
          rule: isEqual('my value'),
          message: 'Field should be "my value"',
        },
      ],
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(2);
    expect(errors[0]).toBe('Field is required');
    expect(errors[1]).toBe('Field should be "my value"');
  });

  it('Should get form values in rule validation', () => {
    let formValues = null;

    const rule = (value, values) => {
      formValues = values;
    };

    const field = {
      name: 'myField',
      value: '',
      isEnabled: true,
      validations: [
        {
          rule,
        },
      ],
    };

    getFieldErrors(field.name, [field]);

    expect(formValues).toHaveProperty('myField', '');
  });

  it('Should return an error if one field has an external error', () => {
    const field = {
      name: 'myField',
      value: 'not my value',
      isEnabled: true,
      externalError: 'External error',
    };

    const errors = getFieldErrors(field.name, [field]);

    expect(errors).toHaveLength(1);
  });
});
