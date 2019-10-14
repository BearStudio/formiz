import { getStepsOrdered } from '../index';

describe('[FormContext:Helper] getStepsOrdered()', () => {
  it('Should return steps in correct order', () => {
    const steps = [
      {
        name: 'step1',
        isEnabled: true,
      },
      {
        name: 'step2',
        isEnabled: true,
      },
      {
        name: 'step3',
        isEnabled: true,
      },
    ];

    const stepsOrdered = getStepsOrdered(steps);

    expect(stepsOrdered[0].name).toBe('step1');
    expect(stepsOrdered[1].name).toBe('step2');
    expect(stepsOrdered[2].name).toBe('step3');
  });

  it('Should return steps in correct order with order property', () => {
    const steps = [
      {
        name: 'step1',
        isEnabled: true,
        order: 30,
      },
      {
        name: 'step3',
        isEnabled: true,
        order: 20,
      },
      {
        name: 'step2',
        isEnabled: true,
        order: 10,
      },
    ];

    const stepsOrdered = getStepsOrdered(steps);

    expect(stepsOrdered[0].name).toBe('step2');
    expect(stepsOrdered[1].name).toBe('step3');
    expect(stepsOrdered[2].name).toBe('step1');
  });

  it('Should return steps in correct order with order property and index', () => {
    const steps = [
      {
        name: 'step1',
        isEnabled: true,
        order: 30,
        index: 0,
      },
      {
        name: 'step3',
        isEnabled: true,
        order: 20,
        index: 1,
      },
      {
        name: 'step2',
        isEnabled: true,
        order: 10,
        index: 3,
      },
    ];

    const stepsOrdered = getStepsOrdered(steps);

    expect(stepsOrdered[0].name).toBe('step2');
    expect(stepsOrdered[1].name).toBe('step3');
    expect(stepsOrdered[2].name).toBe('step1');
  });
});
