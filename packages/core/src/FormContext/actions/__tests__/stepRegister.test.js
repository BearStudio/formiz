import { stepRegister } from '../index';

describe('[FormContext:Action] stepRegister()', () => {
  it('Should register one step', () => {
    const { steps } = stepRegister('myStep')({
      steps: [],
    });

    expect(steps).toHaveLength(1);

    expect(steps[0]).toHaveProperty('name', 'myStep');
    expect(steps[0]).toHaveProperty('order', 0);
    expect(steps[0]).toHaveProperty('index', 0);
    expect(steps[0]).toHaveProperty('isValid', true);
    expect(steps[0]).toHaveProperty('isVisited', false);
    expect(steps[0]).toHaveProperty('isSubmitted', false);
    expect(steps[0]).toHaveProperty('isEnabled', true);
  });

  it('Should register multi steps', () => {
    const state1 = stepRegister('myStep1')({
      steps: [],
    });

    const { steps } = stepRegister('myStep2')(state1);

    expect(steps).toHaveLength(2);

    expect(steps[0]).toHaveProperty('name', 'myStep1');
    expect(steps[0]).toHaveProperty('order', 0);
    expect(steps[0]).toHaveProperty('index', 0);

    expect(steps[1]).toHaveProperty('name', 'myStep2');
    expect(steps[1]).toHaveProperty('order', 0);
    expect(steps[1]).toHaveProperty('index', 1);
  });

  it('Should get steps based on order key and not register order', () => {
    const state1 = stepRegister('myStep2', { order: 2 })({
      steps: [],
    });

    const state2 = stepRegister('myStep3', { order: 3 })(state1);

    const { steps } = stepRegister('myStep1', { order: 1 })(state2);

    expect(steps).toHaveLength(3);

    expect(steps[0]).toHaveProperty('name', 'myStep1');
    expect(steps[0]).toHaveProperty('order', 1);
    expect(steps[0]).toHaveProperty('index', 0);

    expect(steps[1]).toHaveProperty('name', 'myStep2');
    expect(steps[1]).toHaveProperty('order', 2);
    expect(steps[1]).toHaveProperty('index', 1);

    expect(steps[2]).toHaveProperty('name', 'myStep3');
    expect(steps[2]).toHaveProperty('order', 3);
    expect(steps[2]).toHaveProperty('index', 2);
  });
});
