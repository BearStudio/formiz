export const initialState = {
  fields: [],
};

export const formReset = () => () => initialState;

export const fieldRegister = (name, value = null) => state => ({
  ...state,
  fields: [
    ...state.fields.filter(field => field.name !== name),
    {
      ...state.fields.find(field => field.name === name) || {},
      name,
      value: value || null,
      isEnabled: true,
    },
  ],
});

export const fieldUnregister = name => state => ({
  ...state,
  fields: [
    ...state.fields.filter(field => field.name !== name),
    {
      ...state.fields.find(field => field.name === name) || {},
      isEnabled: false,
    },
  ],
});

export const fieldSetValue = (name, value) => state => ({
  ...state,
  fields: [
    ...state.fields.filter(field => field.name !== name),
    {
      ...state.fields.find(field => field.name === name),
      value,
    },
  ],
});
