export const initialState = {
  fields: [],
};

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

export const fieldValidate = name => (state) => {
  const field = state.fields.find(x => x.name === name);
  const otherFields = state.fields.filter(x => x.name !== name);

  if (!field) {
    return state;
  }

  const errors = field.validations
    ? field.validations
      .map(x => (x.rule && !x.rule(field.value) ? x.message : '___FIELD_IS_VALID___'))
      .filter(x => x !== '___FIELD_IS_VALID___')
    : [];

  return {
    ...state,
    fields: [
      ...otherFields,
      {
        ...field,
        errors,
      },
    ],
  };
};
