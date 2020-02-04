import { fieldRegister, formSetFieldsValues } from '../index';

describe('[FormContext:Action] formSetFieldsValues()', () => {
  it('Should set the value of the given field', () => {
    let state = fieldRegister(1, 'fieldA')({ fields: [] });
    state = fieldRegister(2, 'fieldB')(state);
    const { fields } = formSetFieldsValues({
      fieldA: 'new value',
    })(state);

    expect(fields[0]).toHaveProperty('value', 'new value');
    expect(fields[1]).toHaveProperty('value', undefined);
  });
});
