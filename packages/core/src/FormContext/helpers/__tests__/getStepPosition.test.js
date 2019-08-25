import { getStepPosition } from '../index';

describe('[FormContext:Helper] getStepPosition()', () => {
  it('Should return correct position', () => {
    const steps = [
      {
        name: 'step1',
      },
      {
        name: 'step2',
      },
      {
        name: 'step3',
      },
    ];

    const position = getStepPosition('step2', steps);

    expect(position).toBe(1);
  });
});
