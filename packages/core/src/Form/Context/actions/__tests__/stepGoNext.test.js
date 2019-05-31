import { stepGoNext } from '../index';

describe('[FormContext:Action] stepGoNext()', () => {
  it('Should go to next step', () => {
    const { currentStep } = stepGoNext()({
      currentStep: 0,
      steps: [{}, {}, {}],
    });

    expect(currentStep).toBe(1);
  });

  it('Should not go to next step if already on last step', () => {
    const { currentStep } = stepGoNext()({
      currentStep: 2,
      steps: [{}, {}, {}],
    });

    expect(currentStep).toBe(2);
  });
});
