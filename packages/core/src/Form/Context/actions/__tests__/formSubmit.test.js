import { formSubmit } from '../index';

describe('[FormContext:Action] formSubmit()', () => {
  it('isSubmitted should be true after submit', () => {
    const { isSubmitted } = formSubmit()({});
    expect(isSubmitted).toBe(true);
  });
});
