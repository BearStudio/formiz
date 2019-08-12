import { stepGoTo } from '../index';

describe('[FormContext:Action] stepGoTo()', () => {
  it('Should go to the named step', () => {
    const { navigatedStepName } = stepGoTo('step3')({
      navigatedStepName: 'step2',
      steps: [
        { name: 'step1' },
        { name: 'step2' },
        { name: 'step3' },
      ],
    });

    expect(navigatedStepName).toBe('step3');
  });

  it('Should stay at the current step if step name does not exist', () => {
    const { navigatedStepName } = stepGoTo('step4')({
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
