describe('Dynamic Steps', () => {
  beforeEach(() => {
    cy.visit('/dynamic-steps');
    cy.pageTitleIs('Dynamic Steps');
  });

  it('Simple Case', () => {
    cy.contains('1 / 4');
    cy.formNextStep();
    cy.formNextStep();
    cy.formNextStep();
    cy.field('end').fill('end');
    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Increment steps', () => {
    cy.contains('1 / 4');
    cy.field('count').fill('3');
    cy.contains('1 / 5');
    cy.formNextStep();
    cy.formNextStep();
    cy.formNextStep();
    cy.formNextStep();
    cy.field('end').fill('end');
    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Decrement steps', () => {
    cy.contains('1 / 4');
    cy.field('count').fill('1');
    cy.contains('1 / 3');
    cy.formNextStep();
    cy.formNextStep();
    cy.field('end').fill('end');
    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();
  });
});
