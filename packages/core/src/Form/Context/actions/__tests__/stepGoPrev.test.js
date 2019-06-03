import { stepGoPrev } from '../index';

describe('[FormContext:Action] stepGoPrev()', () => {
  it('Should go to prev step', () => {
    const { currentStepName } = stepGoPrev()({
      currentStepName: 'step3',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(currentStepName).toBe('step2');
  });

  it('Should not go to prev step if already on first', () => {
    const { currentStepName } = stepGoPrev()({
      currentStepName: 'step1',
      steps: [
        { name: 'step1', order: 0 },
        { name: 'step2', order: 1 },
        { name: 'step3', order: 2 },
      ],
    });

    expect(currentStepName).toBe('step1');
  });
});
