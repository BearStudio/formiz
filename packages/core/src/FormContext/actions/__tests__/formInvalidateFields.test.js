import { fieldRegister, formInvalidateFields } from '../index';

describe('[FormContext:Action] formInvalidateFields()', () => {
  it('Should invalid the given field', () => {
    let state = fieldRegister(1, 'fieldA')({ fields: [] });
    state = fieldRegister(2, 'fieldB')(state);
    const { fields } = formInvalidateFields({
      fieldA: 'Error',
    })(state);

    expect(fields[0]).toHaveProperty('errors', ['Error']);
    expect(fields[1]).toHaveProperty('errors', []);
  });
});
