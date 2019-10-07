import { stepGoPrev } from '../index';

describe('[FormContext:Action] stepGoPrev()', () => {
  it('Should go to prev step', () => {
    const { navigatedStepName } = stepGoPrev()({
      navigatedStepName: 'step3',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should not go to prev step if already on first', () => {
    const { navigatedStepName } = stepGoPrev()({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step1');
  });

  it('Should skip not enabled steps', () => {
    const { navigatedStepName } = stepGoPrev()({
      navigatedStepName: 'step3',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: false },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step1');
  });
});
