import { stepGoNext } from '../index';

describe('[FormContext:Action] stepGoNext()', () => {
  it('Should go to next step', () => {
    const { navigatedStepName } = stepGoNext()({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should not go to next step if already on last step', () => {
    const { navigatedStepName } = stepGoNext()({
      navigatedStepName: 'step3',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should skip not enabled steps', () => {
    const { navigatedStepName } = stepGoNext()({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: false },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });
});
