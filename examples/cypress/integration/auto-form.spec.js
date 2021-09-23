describe('AutoForm', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.pageTitleIs('Auto form');
  });

  it('Simple Case', () => {
    cy.field('name').type('John');
    cy.field('email').type('john@company.com');
    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Error Email', () => {
    cy.field('email').type('john@company');
    cy.formSubmit();
    cy.field('email').hasError('Not a valid email');
  });

  it('Show errors', () => {
    cy.formSubmit();
    cy.field('name').hasError('Required');
    cy.field('email').hasError('Required');
  });

  it('Set fields errors', () => {
    cy.field('name').type('John');
    cy.field('email').type('john@company.com');

    cy.wait(1000);
    cy.formSubmit();

    cy.field('name').hasError('You can display an error after an API call');

    cy.get('button[type="submit"][disabled]');
  });

  it('Set fields values', () => {
    cy.field('name').type('John');
    cy.field('company').type('Formiz');
    cy.get('button').contains('Fill with').click();

    cy.wait(1000);
    cy.field('name').hasValue('John');
    cy.field('email').hasValue('john@company.com');
    cy.field('company').hasValue('Formiz');
  });
});
