import { getFieldErrors, getStepsOrdered } from '../helpers';

export const initialState = {
  isValid: true,
  isSubmitted: false,
  currentStep: 0,
  steps: [
    /*
    {
      name: 'myStep',
      position: 0
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

  return {
    ...state,
    fields: [
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
    ],
  };
};

export const fieldUnregister = (name, isKeepValue) => (state) => {
  const field = state.fields.find(x => x.name === name);
  const otherFields = state.fields.filter(x => x.name !== name);

  if (!field) {
    return state;
  }

  if (!isKeepValue) {
    return {
      ...state,
      fields: [
        ...otherFields,
      ],
    };
  }

  return {
    ...state,
    fields: [
      ...otherFields,
      {
        ...field,
        isActive: false,
      },
    ],
  };
};

export const fieldSetValue = (name, value) => (state) => {
  const field = state.fields.find(x => x.name === name);
  const otherFields = state.fields.filter(x => x.name !== name);

  if (!field) {
    return state;
  }

  return {
    ...state,
    fields: [
      ...otherFields,
      {
        ...field,
        value,
      },
    ],
  };
};

/*
  Step Actions
*/

export const stepRegister = (name, order = 0) => (state) => {
  const step = state.steps.find(x => x.name === name) || {};
  const otherSteps = state.steps.filter(x => x.name !== name);

  return {
    ...state,
    steps: getStepsOrdered([
      ...otherSteps,
      {
        ...step,
        name,
        order,
      },
    ]),
  };
};

export const stepUnregister = name => (state) => {
  const otherSteps = state.steps.filter(x => x.name !== name);

  return {
    ...state,
    steps: getStepsOrdered(otherSteps),
  };
};

export const stepGoNext = () => (state) => {
  const { currentStep, steps } = state;

  const stepsCount = (steps || []).length;
  const nextStep = stepsCount > 0 ? currentStep + 1 : 0;

  return {
    ...state,
    currentStep: nextStep > stepsCount - 1 ? currentStep : nextStep,
  };
};

export const stepGoPrev = () => (state) => {
  const { currentStep } = state;

  const prevStep = currentStep - 1;

  return {
    ...state,
    currentStep: prevStep < 0 ? 0 : prevStep,
  };
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

  return {
    ...state,
    fields,
    isValid,
  };
};

export const formSubmit = () => state => ({
  ...state,
  isSubmitted: true,
});
