export const getField = (fieldName, fields) => (fields || [])
  .find(x => x.name === fieldName);

export const getFieldsByStep = (stepName, fields) => (fields || [])
  .filter(x => x.step === stepName);

export const getFormValues = fields => (fields || [])
  .filter(field => field.isActive)
  .reduce((obj, field) => ({
    ...obj,
    [field.name]: field.value,
  }), {});

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