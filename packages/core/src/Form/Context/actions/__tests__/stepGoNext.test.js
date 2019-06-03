import { stepGoNext } from '../index';

describe('[FormContext:Action] stepGoNext()', () => {
  it('Should go to next step', () => {
    const { currentStepName } = stepGoNext()({
      currentStepName: 'step1',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(currentStepName).toBe('step2');
  });

  it('Should not go to next step if already on last step', () => {
    const { currentStepName } = stepGoNext()({
      currentStepName: 'step3',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(currentStepName).toBe('step3');
  });
});
