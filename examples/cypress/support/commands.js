// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Custom command to select a field element.
 * @example cy.field('name')
 */
Cypress.Commands.add('field', (name) => cy.get(`[name="${name}"]`));

/**
 * Custom command to see replace the value
 * @example cy.field('name').fill('John')
 */
Cypress.Commands.add(
  'fill',
  {
    prevSubject: 'element',
  },
  (subject, value) => cy.get('input', { withinSubject: subject }).clear().type(value),
);

/**
 * Custom command to see if a field has an value
 * @example cy.field('name').hasValue('John')
 */
Cypress.Commands.add(
  'hasValue',
  {
    prevSubject: 'element',
  },
  (subject, value) => cy.get('input', { withinSubject: subject }).should('have.value', value),
);

/**
 * Custom command to see if a field has an error
 * @example cy.field('name').hasError('Error message')
 */
Cypress.Commands.add(
  'hasError',
  {
    prevSubject: 'element',
  },
  (subject, error) => cy.wrap(subject).get('.chakra-form__error-message').should('contain', error),
);

/**
 * Custom command to send the form.
 * @example cy.formNextStep()
 */
Cypress.Commands.add('formNextStep', () => cy.wait(0).get('[type="submit"]').click());

/**
 * Custom command to send the form.
 * @example cy.formSubmit()
 */
Cypress.Commands.add('formSubmit', () => cy.wait(0).get('[type="submit"]').click());

/**
 * Custom command to check if the form sent successfully.
 * @example cy.isFormSuccess()
 */
Cypress.Commands.add('isFormSuccess', () => cy.get('.chakra-toast').should('contain', 'Values submitted'));

/**
 * Custom command to check if the form sent successfully.
 * @example cy.pageTitleIs('Auto form')
 */
Cypress.Commands.add('pageTitleIs', (title) => cy.get('[data-test="header"]').should('contain', title));
