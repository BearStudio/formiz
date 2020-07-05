import { FormFields } from '../types/form.types';

const isObject = (x: any) => x && typeof x === 'object' && x.constructor === Object;

const parseValues = (values: any) => Object.keys(values)
  .reduce(
    (acc, key) => parseValuesName(key, acc), // eslint-disable-line
    values,
  );

const parseValuesName = (name: any, values: any): any => {
  if (name.indexOf('.') < 0 && name.indexOf('[') < 0) {
    return values;
  }

  const value = values[name];
  const { [name]: deletedKey, ...nextValues } = values || {};
  const [current, ...otherNames] = name.split('.');
  const isArraySyntax = current.match(/\[([0-9]*)\]$/g);

  if (isArraySyntax) {
    const [currentName,, currentIndex] = current.split(/(\[|\])/g);
    const currentCollection = values[currentName] || [];

    if (otherNames.length) {
      const group = {
        ...(values[currentName] && isObject(values[currentName][currentIndex])
          ? values[currentName][currentIndex]
          : {}
        ),
        [otherNames.join('.')]: value,
      };

      currentCollection[currentIndex] = parseValues(group);
    } else {
      currentCollection[currentIndex] = value;
    }

    return {
      ...nextValues,
      [currentName]: currentCollection,
    };
  }

  const group = {
    ...(isObject(values[current]) ? values[current] : {}),
    [otherNames.join('.')]: value,
  };

  return {
    ...nextValues,
    [current]: parseValues(group),
  };
};

export const getFormValues = (fields: FormFields) => {
  const values = (fields || [])
    .filter((field) => field.isEnabled)
    .reduce((obj, field) => ({
      ...obj,
      [field.name]: field.value,
    }), {});

  return parseValues(values);
};
