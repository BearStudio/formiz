import { stepGoPrev } from '../index';

describe('[FormContext:Action] stepGoPrev()', () => {
  it('Should go to prev step', () => {
    const { navigatedStepName } = stepGoPrev()({
      navigatedStepName: 'step3',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should not go to prev step if already on first', () => {
    const { navigatedStepName } = stepGoPrev()({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(navigatedStepName).toBe('step1');
  });
});
