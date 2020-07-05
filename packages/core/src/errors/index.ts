// Fields errors
export const ErrorFieldWithoutForm = new Error('A Formiz field always needs to be a children of a `<Formiz>` component.');
export const ErrorFieldWithoutName = new Error('A Formiz field (component using a useField hook) always needs a `name` props.');

// Steps errors
export const ErrorStepWithoutForm = new Error('A <FormizStep> always needs to be a children of a `<Formiz>` component.');
export const ErrorStepWithoutName = new Error('A <FormizStep> always needs a `name` props.');
