import {
  formSubmit, formReset, stepRegister, stepSetVisited, fieldRegister, fieldSetValue, stepGoTo,
} from '../index';
import { getInitialState } from '../../initialState';

describe('[FormContext:Action] formReset()', () => {
  it('Should reset the form without unregister fields and steps', () => {
    let state = stepRegister('step1')(getInitialState());
    state = stepRegister('step2')(state);
    state = stepRegister('step3')(state);

    state = fieldRegister('fieldA', { step: 'step1' })(state);
    state = fieldRegister('fieldB', { step: 'step2', value: 'Default value' })(state);
    state = fieldRegister('fieldC', { step: 'step3' })(state);

    state = fieldSetValue('fieldA', 'Value A')(state);
    state = fieldSetValue('fieldB', 'Value B')(state);

    state = stepSetVisited('step1')(state);
    state = stepGoTo('step2')(state);
    state = stepSetVisited('step2')(state);

    state = formSubmit()(state);

    // Before reset

    expect(state.isSubmitted).toBe(true);
    expect(state.navigatedStepName).toBe('step2');
    expect(state.resetKey).toBe(0);

    let fieldA = state.fields.find(x => x.name === 'fieldA');
    let fieldB = state.fields.find(x => x.name === 'fieldB');
    let fieldC = state.fields.find(x => x.name === 'fieldC');

    expect(fieldA).toHaveProperty('isPristine', false);
    expect(fieldA).toHaveProperty('value', 'Value A');

    expect(fieldB).toHaveProperty('isPristine', false);
    expect(fieldB).toHaveProperty('value', 'Value B');

    expect(fieldC).toHaveProperty('isPristine', true);
    expect(fieldC).toHaveProperty('value', null);

    expect(state.steps[0]).toHaveProperty('isSubmitted', true);
    expect(state.steps[0]).toHaveProperty('isVisited', true);

    expect(state.steps[1]).toHaveProperty('isSubmitted', true);
    expect(state.steps[1]).toHaveProperty('isVisited', true);

    expect(state.steps[2]).toHaveProperty('isSubmitted', true);
    expect(state.steps[2]).toHaveProperty('isVisited', false);

    // Reset form

    state = formReset()(state);

    // After reset

    expect(state.isSubmitted).toBe(false);
    expect(state.navigatedStepName).toBe('step1');
    expect(state.resetKey).toBe(1);

    fieldA = state.fields.find(x => x.name === 'fieldA');
    fieldB = state.fields.find(x => x.name === 'fieldB');
    fieldC = state.fields.find(x => x.name === 'fieldC');

    expect(fieldA).toHaveProperty('isPristine', true);
    expect(fieldA).toHaveProperty('value', null);

    expect(fieldB).toHaveProperty('isPristine', true);
    expect(fieldB).toHaveProperty('value', 'Default value');

    expect(fieldC).toHaveProperty('isPristine', true);
    expect(fieldC).toHaveProperty('value', null);

    expect(state.steps[0]).toHaveProperty('isSubmitted', false);
    expect(state.steps[0]).toHaveProperty('isVisited', false);

    expect(state.steps[1]).toHaveProperty('isSubmitted', false);
    expect(state.steps[1]).toHaveProperty('isVisited', false);

    expect(state.steps[2]).toHaveProperty('isSubmitted', false);
    expect(state.steps[2]).toHaveProperty('isVisited', false);
  });
});
