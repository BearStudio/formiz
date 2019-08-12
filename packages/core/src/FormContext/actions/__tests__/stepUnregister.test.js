import { stepUnregister } from '../index';

describe('[FormContext:Action] stepUnregister()', () => {
  it('Should remove the step from the state', () => {
    const { steps } = stepUnregister('myStep')({
      steps: [
        {
          name: 'myStep',
          order: 1,
        },
      ],
    });

    expect(steps).toHaveLength(0);
  });

  it('Should not modify the state if the name does not exist', () => {
    const { steps } = stepUnregister('myStep')({
      steps: [
        {
          name: 'anotherStep',
          order: 1,
        },
      ],
    });

    expect(steps).toHaveLength(1);
  });
});
