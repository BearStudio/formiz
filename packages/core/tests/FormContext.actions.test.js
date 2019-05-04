import { fieldRegister } from '../src/FormContext/actions';

describe('FormContext Actions', () => {
  describe('fieldRegister(name, defaultValue)', () => {
    it('Should register the field without value if no defaultValue', () => {
      const result = fieldRegister('myField')({
        fields: [],
      }).fields[0];

      expect(result).toHaveProperty('isEnabled', true);
      expect(result).toHaveProperty('name', 'myField');
      expect(result).toHaveProperty('value', null);
    });

    it('Should register the field with value if defaultValue', () => {
      const result = fieldRegister('myField', 'myValue')({
        fields: [],
      }).fields[0];

      expect(result).toHaveProperty('isEnabled', true);
      expect(result).toHaveProperty('name', 'myField');
      expect(result).toHaveProperty('value', 'myValue');
    });
  });
});
