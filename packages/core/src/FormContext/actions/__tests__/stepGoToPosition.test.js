import { stepGoToPosition } from '../index';

describe('[FormContext:Action] stepGoToPosition()', () => {
  it('Should go to step at position', () => {
    const { navigatedStepName } = stepGoToPosition(2)({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1' },
        { name: 'step2' },
        { name: 'step3' },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should stay at the current step if step position does not exist', () => {
    const { navigatedStepName } = stepGoToPosition(4)({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1' },
        { name: 'step2' },
        { name: 'step3' },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });
});
