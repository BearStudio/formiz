export const initialState = {
  fields: [],
};

export const fieldRegister = (name, value = null) => (state) => {
  const field = state.fields.find(x => x.name === name) || {};

  return {
    ...state,
    fields: [
      ...state.fields.filter(x => x.name !== name),
      {
        ...field,
        name,
        value: field.value || value || null,
        isActive: true,
      },
    ],
  };
};

export const fieldUnregister = (name, isCleaned) => (state) => {
  const field = state.fields.find(x => x.name === name);

  if (!field) {
    return state;
  }

  if (isCleaned) {
    return {
      ...state,
      fields: state.fields.filter(x => x.name !== name),
    };
  }

  return {
    ...state,
    fields: [
      ...state.fields.filter(x => x.name !== name),
      {
        ...field,
        isActive: false,
      },
    ],
  };
};

export const fieldSetValue = (name, value) => (state) => {
  const field = state.fields.find(x => x.name === name);

  if (!field) {
    return state;
  }

  return {
    ...state,
    fields: [
      ...state.fields.filter(x => x.name !== name),
      {
        ...state.fields.find(x => x.name === name),
        value,
      },
    ],
  };
};
