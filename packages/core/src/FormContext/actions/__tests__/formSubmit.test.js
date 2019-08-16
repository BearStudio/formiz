import { formSubmit, stepRegister } from '../index';

describe('[FormContext:Action] formSubmit()', () => {
  it('isSubmitted should be true after submit', () => {
    const { isSubmitted } = formSubmit()({});
    expect(isSubmitted).toBe(true);
  });

  it('all steps should be submitted after form submit', () => {
    let state = stepRegister('step1')({ steps: [] });
    state = stepRegister('step2')(state);
    state = stepRegister('step3')(state);

    const { isSubmitted, steps } = formSubmit()(state);
    expect(isSubmitted).toBe(true);
    expect(steps[0]).toHaveProperty('isSubmitted', true);
    expect(steps[1]).toHaveProperty('isSubmitted', true);
    expect(steps[2]).toHaveProperty('isSubmitted', true);
  });
});
