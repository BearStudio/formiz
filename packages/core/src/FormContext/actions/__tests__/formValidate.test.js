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

  it('current step should be valid if all fields are valid in the current step', () => {
    const { isValid, steps } = formValidate()({
      navigatedStepName: 'step2',
      steps: [{ name: 'step1' }, { name: 'step2' }],
      fields: [
        {
          name: 'a',
          step: 'step1',
          validations: [
            {
              rule: isRequired(),
            },
          ],
        },
        {
          name: 'b',
          step: 'step2',
          value: 'my value',
          validations: [
            {
              rule: isEqual('my value'),
            },
          ],
        },
      ],
    });

    expect(isValid).toBe(false);
    expect(steps[1]).toHaveProperty('isValid', true);
  });

  it('current step should not be valid if one field is invalid in the current step', () => {
    const { isValid, steps } = formValidate()({
      navigatedStepName: 'step1',
      steps: [{ name: 'step1' }, { name: 'step2' }],
      fields: [
        {
          name: 'a',
          step: 'step1',
          validations: [
            {
              rule: isRequired(),
            },
          ],
        },
        {
          name: 'b',
          step: 'step2',
          validations: [
            {
              rule: isEqual('my value'),
            },
          ],
        },
      ],
    });

    expect(isValid).toBe(false);
    expect(steps[0]).toHaveProperty('isValid', false);
  });

  it('current step should be valid if no fields available in current step', () => {
    const { isValid, steps } = formValidate()({
      navigatedStepName: 'step1',
      steps: [{ name: 'step1' }, { name: 'step2' }],
      fields: [
        {
          name: 'a',
          step: 'step2',
          validations: [
            {
              rule: isRequired(),
            },
          ],
        },
        {
          name: 'b',
          step: 'step2',
          validations: [
            {
              rule: isEqual('my value'),
            },
          ],
        },
      ],
    });

    expect(isValid).toBe(false);
    expect(steps[0]).toHaveProperty('isValid', true);
  });
});
