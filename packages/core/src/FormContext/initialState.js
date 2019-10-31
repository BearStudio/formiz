export const getInitialState = id => ({
  id,
  resetKey: 1,
  isValid: true,
  isSubmitted: false,
  initialStepName: null,
  navigatedStepName: null,
  steps: [
    /*
    {
      name: 'myStep',
      order: 0,
      index: 0,
      isValid: true,
      isVisited: false,
      isSubmitted: false,
      isEnabled: true,
    }
    */
  ],
  fields: [
    /*
    {
      name: 'myField',
      value: 'Field Value',
      defaultValue: 'Field Value',
      isEnabled: true,
      isPristine: true,
      step: 'stepName',
      validations: [],
      errors: [],
      externalError: null,
    }
    */
  ],
});
