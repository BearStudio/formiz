import { stepGoPrev } from '../index';

describe('[FormContext:Action] stepGoPrev()', () => {
  it('Should go to prev step', () => {
    const { currentStep } = stepGoPrev()({
      currentStep: 2,
      steps: [{}, {}, {}],
    });

    expect(currentStep).toBe(1);
  });

  it('Should not go to prev step if already on first', () => {
    const { currentStep } = stepGoPrev()({
      currentStep: 0,
      steps: [{}, {}, {}],
    });

    expect(currentStep).toBe(0);
  });
});
