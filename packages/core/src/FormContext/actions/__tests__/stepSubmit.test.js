import { stepRegister, stepSubmit, stepGoTo } from '../index';
import { initialState } from '../../initialState';

describe('[FormContext:Action] stepSubmit()', () => {
  it('Should submit step and go to next step', () => {
    let state = stepRegister('step1')(initialState);
    state = stepRegister('step2')(state);
    state = stepRegister('step3')(state);

    expect(state.initialStepName).toBe('step1');

    state = stepSubmit('step1')(state);

    expect(state.navigatedStepName).toBe('step2');

    expect(state).toHaveProperty('isSubmitted', false);
    expect(state.steps[0]).toHaveProperty('isSubmitted', true);
    expect(state.steps[1]).toHaveProperty('isSubmitted', false);
    expect(state.steps[2]).toHaveProperty('isSubmitted', false);
  });

  it('Should submit step and submit form if it is the last step', () => {
    let state = stepRegister('step1')(initialState);
    state = stepRegister('step2')(state);
    state = stepRegister('step3')(state);

    expect(state.initialStepName).toBe('step1');

    state = stepGoTo('step3')(state);

    expect(state.navigatedStepName).toBe('step3');

    state = stepSubmit('step3')(state);

    expect(state).toHaveProperty('isSubmitted', true);
    expect(state.steps[0]).toHaveProperty('isSubmitted', true);
    expect(state.steps[1]).toHaveProperty('isSubmitted', true);
    expect(state.steps[2]).toHaveProperty('isSubmitted', true);
  });
});
