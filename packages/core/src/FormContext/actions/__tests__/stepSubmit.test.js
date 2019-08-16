import { stepRegister, stepSubmit } from '../index';

describe('[FormContext:Action] stepSubmit()', () => {
  it('Should submit step', () => {
    let state = stepRegister('step1')({ steps: [] });
    state = stepRegister('step2')(state);
    state = stepRegister('step3')(state);

    const { steps } = stepSubmit('step1')(state);

    expect(steps[0]).toHaveProperty('isSubmitted', true);
    expect(steps[1]).toHaveProperty('isSubmitted', false);
    expect(steps[2]).toHaveProperty('isSubmitted', false);
  });
});
