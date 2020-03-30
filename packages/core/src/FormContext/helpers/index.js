const isObject = (x) => x && typeof x === 'object' && x.constructor === Object;

const parseValues = (values) => Object.keys(values)
  .reduce(
    (acc, key) => parseValuesName(key, acc), // eslint-disable-line no-use-before-define
    values,
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
    .filter((field) => field.isEnabled)
    .reduce((obj, field) => ({
      ...obj,
      [field.name]: field.value,
    }), {});

  return parseValues(values);
};

export const getFieldByKeyValue = (key, value, fields) => {
  // Use for loop instead of find
  // because of performance optimization
  let field;

  for (let i = 0; i < fields.length; i += 1) {
    if (fields[i][key] === value) {
      field = fields[i];
      break;
    }
  }

  return field;
};

export const getFieldAndOtherFieldsByKeyValue = (key, value, fields = []) => {
  // Use for loop instead of find/filter or reduce
  // because of performance optimization
  let field;
  const otherFields = [];

  for (let i = 0; i < fields.length; i += 1) {
    if (fields[i][key] === value) {
      field = fields[i];
    } else {
      otherFields.push(fields[i]);
    }
  }

  return [field, otherFields];
};

export const getFieldErrors = (field) => {
  if (!field) {
    return [];
  }

  const errorMessages = (field.validations || [])
    .reduce((acc, cur) => (cur.rule && !cur.rule(field.value) ? [...acc, cur.message] : acc), []);

  if (field.externalError) {
    return [field.externalError, ...errorMessages];
  }

  return errorMessages;
};

export const getEnabledSteps = (steps) => (steps || [])
  .filter((x) => x.isEnabled);

export const getStepsOrdered = (steps) => (steps || [])
  .sort((a, b) => a.index - b.index)
  .sort((a, b) => a.order - b.order)
  .map((x, index) => ({ ...x, index }));

export const getCurrentStepNameFromState = (state) => (
  state.navigatedStepName
  || state.initialStepName
);

export const getStepPosition = (stepName, steps) => (steps || [])
  .filter((x) => x.isEnabled)
  .findIndex((x) => x.name === stepName) || 0;

export const getStep = (stepName, steps) => {
  const enabledSteps = getEnabledSteps(steps);
  return getStepsOrdered(enabledSteps)
    .find((x) => x.name === stepName) || {};
};

export const getFieldStepName = (fieldName, fields) => {
  const field = getFieldByKeyValue('name', fieldName, fields);

  if (!field || !field.isEnabled) {
    return undefined;
  }

  return field.step;
};

export const getUniqueId = (key) => `formiz-${key}-id-${Math.random().toString(36).substr(2, 9)}`;
