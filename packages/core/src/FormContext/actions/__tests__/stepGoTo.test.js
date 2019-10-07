import { stepGoTo } from '../index';

describe('[FormContext:Action] stepGoTo()', () => {
  it('Should go to the named step', () => {
    const { navigatedStepName } = stepGoTo('step3')({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should stay at the current step if step name does not exist', () => {
    const { navigatedStepName } = stepGoTo('step4')({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: true },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });

  it('Should stay at the current step if step name is not enabled', () => {
    const { navigatedStepName } = stepGoTo('step3')({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1', isEnabled: true },
        { name: 'step2', isEnabled: true },
        { name: 'step3', isEnabled: false },
      ],
    });

    expect(navigatedStepName).toBe('step2');
  });
});
