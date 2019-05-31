import { stepRegister } from '../index';

describe('[FormContext:Action] stepRegister()', () => {
  it('Should register one step', () => {
    const { steps } = stepRegister('myStep', 1)({
      steps: [],
    });

    expect(steps).toHaveLength(1);

    expect(steps[0]).toHaveProperty('name', 'myStep');
    expect(steps[0]).toHaveProperty('order', 1);
  });

  it('Should register multi steps', () => {
    const state1 = stepRegister('myStep1', 1)({
      steps: [],
    });

    const { steps } = stepRegister('myStep2', 2)(state1);

    expect(steps).toHaveLength(2);

    expect(steps[0]).toHaveProperty('name', 'myStep1');
    expect(steps[0]).toHaveProperty('order', 1);

    expect(steps[1]).toHaveProperty('name', 'myStep2');
    expect(steps[1]).toHaveProperty('order', 2);
  });

  it('Should get steps based on order key and not register order', () => {
    const state1 = stepRegister('myStep2', 2)({
      steps: [],
    });

    const state2 = stepRegister('myStep3', 3)(state1);

    const { steps } = stepRegister('myStep1', 1)(state2);

    expect(steps).toHaveLength(3);

    expect(steps[0]).toHaveProperty('name', 'myStep1');
    expect(steps[0]).toHaveProperty('order', 1);

    expect(steps[1]).toHaveProperty('name', 'myStep2');
    expect(steps[1]).toHaveProperty('order', 2);

    expect(steps[2]).toHaveProperty('name', 'myStep3');
    expect(steps[2]).toHaveProperty('order', 3);
  });
});
