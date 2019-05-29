import { getFieldErrors } from '../helpers';

export const initialState = {
  currentStep: 0,
  isFormValid: true,
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

export const fieldRegister = (name, value = null, validations = []) => (state) => {
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
        errors: [],
        validations,
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
  Form Actions
*/

export const formValidate = () => (state) => {
  const fields = (state.fields || [])
    .map(x => ({
      ...x,
      errors: getFieldErrors(x.name, state.fields),
    }));

  const isFormValid = fields.every(x => !x.errors.length);

  return {
    ...state,
    fields,
    isFormValid,
  };
};
