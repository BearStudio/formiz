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

  it('isStepValid should be true if there is no step', () => {
    const { isStepValid } = formValidate()({
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

    expect(isStepValid).toBe(true);
  });

  it('isStepValid should be true if all fields are valid in the current step', () => {
    const { isValid, isStepValid } = formValidate()({
      currentStepName: 'step2',
      steps: [{ name: 'step1', order: 0 }, { name: 'step2', order: 1 }],
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
    expect(isStepValid).toBe(true);
  });

  it('isStepValid should be false if one field is invalid in the current step', () => {
    const { isValid, isStepValid } = formValidate()({
      currentStepName: 'step1',
      steps: [{ name: 'step1', order: 0 }, { name: 'step2', order: 1 }],
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
    expect(isStepValid).toBe(false);
  });

  it('isStepValid should be true if no fields available in current step', () => {
    const { isValid, isStepValid } = formValidate()({
      currentStepName: 'step1',
      steps: [{ name: 'step1', order: 0 }, { name: 'step2', order: 1 }],
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
    expect(isStepValid).toBe(true);
  });
});
