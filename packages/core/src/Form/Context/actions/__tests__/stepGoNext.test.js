import { stepGoNext } from '../index';

describe('[FormContext:Action] stepGoNext()', () => {
  it('Should go to next step', () => {
    const { navigatedStepName } = stepGoNext()({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should not go to next step if already on last step', () => {
    const { navigatedStepName } = stepGoNext()({
      navigatedStepName: 'step3',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });
});
