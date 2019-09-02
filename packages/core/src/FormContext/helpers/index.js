const isObject = x => x && typeof x === 'object' && x.constructor === Object;

const parseValues = values => Object.keys(values)
  .reduce(
    (acc, key) => parseValuesName(key, acc), // eslint-disable-line no-use-before-define
    values
  );

// TODO: refactoring
const parseValuesName = (name, values) => {
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

export const getFormValues = (fields) => {
  const values = (fields || [])
    .filter(field => field.isActive)
    .reduce((obj, field) => ({
      ...obj,
      [field.name]: field.value,
    }), {});

  return parseValues(values);
};

export const getField = (fieldName, fields) => (fields || [])
  .find(x => x.name === fieldName);

export const getFieldsByStep = (stepName, fields) => (fields || [])
  .filter(x => x.step === stepName);

export const getFieldErrors = (fieldName, fields) => {
  const field = getField(fieldName, fields);

  if (!field) {
    return [];
  }

  const errorMessages = (field.validations || [])
    .map(x => (x.rule && !x.rule(field.value, getFormValues(fields)) ? x.message : '___FIELD_IS_VALID___'))
    .filter(x => x !== '___FIELD_IS_VALID___');

  if (field.externalError) {
    return [field.externalError, ...errorMessages];
  }

  return errorMessages;
};

export const getStep = (stepName, steps) => (steps || [])
  .find(x => x.name === stepName) || {};

export const getCurrentStepNameFromState = state => (
  state.navigatedStepName
  || state.initialStepName
);

export const getStepPosition = (stepName, steps) => (steps || [])
  .findIndex(x => x.name === stepName) || 0;

export const getStepsOrdered = steps => (steps || [])
  .sort((a, b) => a.order - b.order)
  .sort((a, b) => a.index - b.index);

export const getFieldStepName = (fieldName, fields) => {
  const field = fields.find(x => x.name === fieldName);

  if (!field || !field.isActive) {
    return undefined;
  }

  return field.step;
};
