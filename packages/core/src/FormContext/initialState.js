export const getInitialState = id => ({
  id,
  resetKey: 0,
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
    }
    */
  ],
  fields: [
    /*
    {
      name: 'myField',
      value: 'Field Value',
      defaultValue: 'Field Value',
      isActive: true,
      isPristine: true,
      step: 'stepName',
      validations: [],
      errors: [],
    }
    */
  ],
});
