import { stepGoToPosition } from '../index';

describe('[FormContext:Action] stepGoToPosition()', () => {
  it('Should go to step at position', () => {
    const { navigatedStepName } = stepGoToPosition(2)({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should stay at the current step if step position does not exist', () => {
    const { navigatedStepName } = stepGoToPosition(3)({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should stay at the current step if step position does not exist with not enabled steps', () => {
    const { navigatedStepName } = stepGoToPosition(1)({
      navigatedStepName: 'step1',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: false },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should ignore not available steps', () => {
    const { navigatedStepName } = stepGoToPosition(1)({
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
