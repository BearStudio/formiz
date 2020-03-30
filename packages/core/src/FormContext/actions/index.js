import {
  getFieldErrors,
  getCurrentStepNameFromState,
  getStepsOrdered,
  getStepPosition,
  getFormValues,
  getEnabledSteps,
  getFieldAndOtherFieldsByKeyValue,
} from '../helpers';

/*
  Form Actions
*/

export const formValidate = () => (state) => {
  // Reset the form to valid state
  let isValid = true;

  // Reset each steps to valid state
  const steps = [...(state.steps || [])].map((x) => ({ ...x, isValid: true }));

  const fields = (state.fields || [])
    .map((field) => {
      const errors = getFieldErrors(field);

      if (field.isEnabled && errors.length) {
        // Invalidate the form
        isValid = false;

        // Invalidate the step
        const stepIndex = steps.findIndex((x) => x.name === field.step);
        if (stepIndex > -1) { steps[stepIndex].isValid = false; }
      }

      return {
        ...field,
        errors,
      };
    });

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

export const formSetFieldsValues = (fieldsValues) => (state) => {
  const fields = state.fields.map((field) => {
    const newValue = fieldsValues[field.name];

    if (newValue === undefined) {
      return field;
    }

    return {
      ...field,
      value: newValue,
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
    value = undefined,
    step = undefined,
    validations = [],
    isKeepValue = false,
  } = {},
) => (state) => {
  let [field = {}, otherFields] = getFieldAndOtherFieldsByKeyValue('id', id, state.fields);

  // If there is no previous field with the given id
  // And if we want to keep the previous value
  // Retrieve the previous field by name
  if (!field.id && isKeepValue) {
    [field = {}, otherFields] = getFieldAndOtherFieldsByKeyValue('name', name, state.fields);
  }

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
  const [field, otherFields] = getFieldAndOtherFieldsByKeyValue('id', id, state.fields);

  if (!field) {
    return state;
  }

  const fields = !isKeepValue ? otherFields : [
    ...otherFields,
    {
      id,
      name: field.name,
      value: field.value,
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
  const [field, otherFields] = getFieldAndOtherFieldsByKeyValue('id', id, state.fields);

  if (!field) {
    return state;
  }

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
  const [field, otherFields] = getFieldAndOtherFieldsByKeyValue('id', id, state.fields);

  if (!field) {
    return state;
  }

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
