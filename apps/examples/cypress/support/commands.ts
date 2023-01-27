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
import '@testing-library/cypress/add-commands'
import 'cypress-keyboard-plugin';
import 'cypress-plugin-tab';

Cypress.Commands.add('field', (name) => cy.get(`[id*="field-${name}"]`));

Cypress.Commands.add(
  'fill',
  {
    prevSubject: 'element',
  },
  (subject, value) => cy
    .wrap(subject)
    .clear()
    .type(value),
);

Cypress.Commands.add(
  'hasValue',
  {
    prevSubject: 'element',
  },
  (subject, value) => cy.wrap(subject).should('have.value', value),
);

Cypress.Commands.add(
  'hasError',
  {
    prevSubject: 'element',
  },
  (subject, error) => cy
    .wrap(subject)
    .get('.chakra-form__error-message')
    .should('contain', error),
);

Cypress.Commands.add('formNextStep', () => cy
  .wait(500)
  .get('[type="submit"]')
  .click());

Cypress.Commands.add('formSubmit', () => cy
  .wait(500)
  .get('[type="submit"]')
  .click());

Cypress.Commands.add('isFormSuccess', () => cy.get('.chakra-toast').should('contain', 'Submitted values'));

Cypress.Commands.add('pageTitleIs', (title) => cy.get('[data-test="header"]').should('contain', title));
