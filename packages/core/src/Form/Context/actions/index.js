import {
  getFieldsByStep,
  getFieldErrors,
  getStep,
  getCurrentStepNameFromState,
  getStepsOrdered,
  getStepPosition,
} from '../helpers';

export const initialState = {
  isValid: true,
  isSubmitted: false,
  initialStepName: null,
  navigatedStepName: null,
  steps: [
    /*
    {
      name: 'myStep',
      order: 0,
      isValid: true,
      isVisited: false,
    }
    */
  ],
  fields: [
    /*
    {
      name: 'myField',
      value: 'Field Value',
      isActive: true,
      validations: [],
      errors: [],
    }
    */
  ],
};

/*
  Form Actions
*/

export const formValidate = () => (state) => {
  const fields = (state.fields || [])
    .map(x => ({
      ...x,
      errors: getFieldErrors(x.name, state.fields),
    }));

  const isValid = fields.every(x => !x.errors.length);
  const currenStepName = getCurrentStepNameFromState(state);
  const step = getStep(currenStepName, state.steps);
  const steps = (state.steps || []).map(s => ({
    ...s,
    isValid: getFieldsByStep(s.name, fields).every(x => !x.errors.length),
  }));
  const isStepValid = (steps.find(x => x.name === step.name) || {}).isValid;


  return {
    ...state,
    fields,
    steps,
    isValid,
    isStepValid: isStepValid === undefined ? true : isStepValid,
  };
};

export const formSubmit = () => state => ({
  ...state,
  isSubmitted: true,
});


/*
  Step Actions
*/

export const stepRegister = (name, order = 0) => (state) => {
  const step = state.steps.find(x => x.name === name) || {};
  const otherSteps = state.steps.filter(x => x.name !== name);
  const steps = getStepsOrdered([
    ...otherSteps,
    {
      ...step,
      name,
      order,
      isValid: true,
      isVisited: false,
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

export const stepUnregister = name => (state) => {
  const otherSteps = state.steps.filter(x => x.name !== name);
  const steps = getStepsOrdered(otherSteps);

  let newState = {
    ...state,
    steps,
  };

  newState = formValidate()(newState);

  return newState;
};

export const stepSetVisited = name => (state) => {
  const step = state.steps.find(x => x.name === name) || {};
  const otherSteps = state.steps.filter(x => x.name !== name);
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

export const stepGoTo = name => (state) => {
  const { steps } = state;

  const newStep = (steps || []).find(x => x.name === name);

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

export const stepGoToPosition = position => (state) => {
  const { steps } = state;

  const newStep = (steps || [])[position] || {};

  return stepGoTo(newStep.name)(state);
};

export const stepGoNext = () => (state) => {
  const { steps } = state;

  const stepsCount = (steps || []).length;
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

/*
  Field Actions
*/

export const fieldRegister = (
  name,
  {
    value = null,
    step = null,
    validations = [],
  } = {}
) => (state) => {
  const field = state.fields.find(x => x.name === name) || {};
  const otherFields = state.fields.filter(x => x.name !== name);
  const fields = [
    ...otherFields,
    {
      ...field,
      name,
      value: field.value || value,
      isActive: true,
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

export const fieldUnregister = (name, isKeepValue) => (state) => {
  const field = state.fields.find(x => x.name === name);
  const otherFields = state.fields.filter(x => x.name !== name);

  if (!field) {
    return state;
  }

  const fields = !isKeepValue ? otherFields : [
    ...otherFields,
    {
      ...field,
      isActive: false,
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};

export const fieldSetValue = (name, value) => (state) => {
  const field = state.fields.find(x => x.name === name);
  const otherFields = state.fields.filter(x => x.name !== name);

  if (!field) {
    return state;
  }

  const fields = [
    ...otherFields,
    {
      ...field,
      value,
    },
  ];

  let newState = {
    ...state,
    fields,
  };

  newState = formValidate()(newState);

  return newState;
};
