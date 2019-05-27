import { formValidate } from '../index';

const isRequired = () => x => !!x;
const isEqual = match => x => x === match;

describe('[FormContext:Action] formValidate()', () => {
  it('isFormValid should be true if no fields are registred', () => {
    const { isFormValid } = formValidate()({});
    expect(isFormValid).toBe(true);
  });

  it('isFormValid should be false if one field is not valid', () => {
    const { isFormValid } = formValidate()({
      fields: [
        {
          name: 'a',
          validations: [
            {
              rule: x => !!x,
            },
          ],
        },
        {
          name: 'b',
        },
      ],
    });
    expect(isFormValid).toBe(false);
  });

  it('isFormValid should be true if all fields are valid', () => {
    const { isFormValid } = formValidate()({
      fields: [
        {
          name: 'a',
          value: 'value',
          validations: [
            {
              rule: isRequired(),
            },
          ],
        },
        {
          name: 'b',
          value: 'my value',
          validations: [
            {
              rule: isEqual('my value'),
            },
          ],
        },
      ],
    });

    expect(isFormValid).toBe(true);
  });
});
