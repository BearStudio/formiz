// load the 3rd party command definition for cy.waitUntil()
/// <reference types="cypress-keyboard-plugin" />

// typically custom commands are added in this support folder
// so it makes sense to put their TypeScript definitions here
// from the JavaScript specs loads this file using
// the triple slash "reference" comment like this:
//
// /// <reference path="../support/index.d.ts" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select a field element.
     * @example cy.field('name')
     */
    field(value: string): Chainable<JQuery<Element>>;
    /**
     * Custom command to see replace the value
     * @example cy.field('name').fill('John')
     */
    fill(value: string): Chainable<JQuery<Element>>;

    /**
     * Custom command to see if a field has an value
     * @example cy.field('name').hasValue('John')
     */
    hasValue(value: string): Chainable<JQuery<Element>>;

    /**
     * Custom command to see if a field has an error
     * @example cy.field('name').hasError('Error message')
     */
    hasError(errorMessage: string): Chainable<JQuery<Element>>;

    /**
     * Custom command to send the form.
     * @example cy.formNextStep()
     */
    formNextStep(): Chainable<JQuery<Element>>;

    /**
     * Custom command to send the form.
     * @example cy.formSubmit()
     */
    formSubmit(): Chainable<JQuery<Element>>;

    /**
     * Custom command to check if the form sent successfully.
     * @example cy.isFormSuccess()
     */
    isFormSuccess(): Chainable<JQuery<Element>>;

    /**
     * Custom command to check if the form sent successfully.
     * @example cy.pageTitleIs('Auto form')
     */
    pageTitleIs(title: string): Chainable<JQuery<Element>>;
  }
}
