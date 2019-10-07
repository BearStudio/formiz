import { getStepPosition } from '../index';

describe('[FormContext:Helper] getStepPosition()', () => {
  it('Should return correct position', () => {
    const steps = [
      {
        name: 'step1',
        isEnabled: true,
      },
      {
        name: 'step2',
        isEnabled: true,
      },
      {
        name: 'step3',
        isEnabled: true,
      },
    ];

    const position = getStepPosition('step2', steps);

    expect(position).toBe(1);
  });

  it('Should return correct position with not enabled steps', () => {
    const steps = [
      {
        name: 'step1',
        isEnabled: true,
      },
      {
        name: 'step2',
        isEnabled: false,
      },
      {
        name: 'step3',
        isEnabled: true,
      },
    ];

    const position = getStepPosition('step3', steps);

    expect(position).toBe(1);
  });
});
