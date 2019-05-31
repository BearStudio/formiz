import { formValidate } from '../index';

const isRequired = () => x => !!x;
const isEqual = match => x => x === match;

describe('[FormContext:Action] formValidate()', () => {
  it('isValid should be true if no fields are registred', () => {
    const { isValid } = formValidate()({});
    expect(isValid).toBe(true);
  });

  it('isValid should be false if one field is not valid', () => {
    const { isValid } = formValidate()({
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
    expect(isValid).toBe(false);
  });

  it('isValid should be true if all fields are valid', () => {
    const { isValid } = formValidate()({
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

    expect(isValid).toBe(true);
  });
});
