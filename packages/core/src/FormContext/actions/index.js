import {
  getEnabledFieldsByStep,
  getFieldErrors,
  getCurrentStepNameFromState,
  getStepsOrdered,
  getStepPosition,
  getFormValues,
  getEnabledSteps,
} from '../helpers';

/*
  Form Actions
*/

export const formValidate = () => (state) => {
  const fields = (state.fields || [])
    .map((x) => ({
      ...x,
      errors: getFieldErrors(x.name, state.fields),
    }));

  const isValid = fields.filter((x) => x.isEnabled).every((x) => !x.errors.length);
  const steps = (state.steps || []).map((s) => ({
    ...s,
    isValid: getEnabledFieldsByStep(s.name, fields).every((x) => !x.errors.length),
  }));

  return {
    ...state,
    fields,
    steps,
    isValid,
  };
};

export const formInvalidateFields = (fieldsErrors) => (state) => {
  const fields = state.fields.map((field) => {
    const errorMessage = fieldsErrors[field.name];

    if (!errorMessage) {
      return field;
    }

    return {
      ...field,
      externalError: errorMessage,
    };
  });

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};

export const formSubmit = (
  callback = () => {},
  callbackOnValid = () => {},
  callbackOnInvalid = () => {},
) => (state) => {
  const steps = (state.steps || []).map((step) => ({
    ...step,
    isSubmitted: true,
  }));

  const formValues = getFormValues(state.fields);

  callback(formValues);

  let newState = {
    ...state,
    steps,
    isSubmitted: true,
  };

  newState = formValidate()(newState);

  if (newState.isValid) {
    callbackOnValid(formValues);
  } else {
    callbackOnInvalid(formValues);
  }

  return newState;
};

export const formReset = () => (state) => {
  const fields = (state.fields || []).map(({ externalError, ...field }) => ({
    ...field,
    isPristine: true,
    value: field.defaultValue,
  }));

  const steps = (state.steps || []).map((step) => ({
    ...step,
    isSubmitted: false,
    isVisited: false,
  }));

  let newState = {
    ...state,
    fields,
    steps,
    isSubmitted: false,
    navigatedStepName: state.initialStepName,
    resetKey: state.resetKey + 1,
  };

  newState = formValidate()(newState);

  return newState;
};

/*
  Step Actions
*/

export const stepRegister = (name, { order = 0, label = '', isEnabled = true } = {}) => (state) => {
  const step = state.steps.find((x) => x.name === name) || {};
  const otherSteps = state.steps.filter((x) => x.name !== name);
  const steps = getStepsOrdered([
    ...otherSteps,
    {
      ...step,
      name,
      label,
      order,
      isValid: true,
      isVisited: false,
      isSubmitted: false,
      isEnabled,
    },
  ]);

  let newState = {
    ...state,
    steps,
    initialStepName: steps.length ? steps[0].name : null,
  };

  newState = formValidate()(newState);

  return newState;
};

export const stepUnregister = (name) => (state) => {
  const otherSteps = state.steps.filter((x) => x.name !== name);
  const steps = getStepsOrdered(otherSteps);

  let newState = {
    ...state,
    steps,
  };

  newState = formValidate()(newState);

  return newState;
};

export const stepUpdate = (name, { label, isEnabled } = {}) => (state) => {
  const step = state.steps.find((x) => x.name === name) || {};
  const otherSteps = state.steps.filter((x) => x.name !== name);
  const steps = getStepsOrdered([
    ...otherSteps,
    {
      ...step,
      label,
      isEnabled,
    },
  ]);

  return {
    ...state,
    steps,
  };
};

export const stepSetVisited = (name) => (state) => {
  const step = state.steps.find((x) => x.name === name) || {};
  const otherSteps = state.steps.filter((x) => x.name !== name);
  const steps = getStepsOrdered([
    ...otherSteps,
    {
      ...step,
      isVisited: true,
    },
  ]);

  return {
    ...state,
    steps,
  };
};

export const stepGoTo = (name) => (state) => {
  const { steps } = state;

  const newStep = getEnabledSteps(steps).find((x) => x.name === name);

  if (!newStep || !newStep.name) {
    return state;
  }

  let newState = {
    ...state,
    navigatedStepName: newStep.name,
  };

  newState = formValidate()(newState);

  return newState;
};

export const stepGoToPosition = (position) => (state) => {
  const { steps } = state;

  const newStep = getEnabledSteps(steps)[position] || {};

  return stepGoTo(newStep.name)(state);
};

export const stepGoNext = () => (state) => {
  const { steps } = state;

  const stepsCount = getEnabledSteps(steps).length;
  const currenStepName = getCurrentStepNameFromState(state);
  const currentStepPosition = getStepPosition(currenStepName, steps);
  let nextStepPosition = stepsCount > 0 ? currentStepPosition + 1 : 0;
  nextStepPosition = nextStepPosition > stepsCount - 1 ? currentStepPosition : nextStepPosition;

  return stepGoToPosition(nextStepPosition)(state);
};

export const stepGoPrev = () => (state) => {
  const { steps } = state;

  const currenStepName = getCurrentStepNameFromState(state);
  const currentStepPosition = getStepPosition(currenStepName, steps);

  let prevStepPosition = currentStepPosition - 1;
  prevStepPosition = prevStepPosition < 0 ? 0 : prevStepPosition;

  return stepGoToPosition(prevStepPosition)(state);
};

export const stepSubmit = (
  name,
  callback = () => {},
  callbackOnValid = () => {},
  callbackOnInvalid = () => {},
) => (state) => {
  const step = state.steps.find((x) => x.name === name) || {};
  const otherSteps = state.steps.filter((x) => x.name !== name);
  const steps = getStepsOrdered([
    ...otherSteps,
    {
      ...step,
      isSubmitted: true,
    },
  ]);

  let newState = {
    ...state,
    steps,
  };

  if (!step.isValid) {
    return newState;
  }

  const { navigatedStepName: prevStepName } = newState;

  newState = stepGoNext()(newState);

  if (prevStepName === newState.navigatedStepName) {
    newState = formSubmit(callback, callbackOnValid, callbackOnInvalid)(newState);
  }

  return newState;
};

/*
  Field Actions
*/

export const fieldRegister = (
  id,
  name,
  {
    value = null,
    step = null,
    validations = [],
  } = {},
) => (state) => {
  const field = state.fields.find((x) => x.name === name) || {};
  const otherFields = state.fields.filter((x) => x.name !== name);
  const fields = [
    ...otherFields,
    {
      ...field,
      id,
      name,
      value: field.value || value,
      defaultValue: value,
      isEnabled: true,
      isPristine: true,
      step,
      validations,
      errors: [],
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};

export const fieldUnregister = (id, isKeepValue) => (state) => {
  const field = state.fields.find((x) => x.id === id);

  if (!field) {
    return state;
  }

  const otherFields = state.fields.filter((x) => x.id !== id);

  const fields = !isKeepValue ? otherFields : [
    ...otherFields,
    {
      ...field,
      isEnabled: false,
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};

export const fieldUpdateValidations = (
  id,
  validations,
) => (state) => {
  const field = state.fields.find((x) => x.id === id);

  if (!field) {
    return state;
  }

  const otherFields = state.fields.filter((x) => x.id !== id);
  const fields = [
    ...otherFields,
    {
      ...field,
      validations,
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};

export const fieldSetValue = (id, value) => (state) => {
  const field = state.fields.find((x) => x.id === id);

  if (!field) {
    return state;
  }

  const otherFields = state.fields.filter((x) => x.id !== id);
  const { externalError, ...fieldWithoutExternalError } = field;

  const fields = [
    ...otherFields,
    {
      ...fieldWithoutExternalError,
      value,
      isPristine: false,
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};
