describe("Wizard", () => {
  beforeEach(() => {
    cy.visit("/wizard");
    cy.pageTitleIs("Wizard");
  });

  it("Simple Case", () => {
    cy.field("name").fill("John");
    cy.formNextStep();

    cy.wait(2000);

    cy.field("email").fill("john@company.com");
    cy.formNextStep();

    cy.wait(2000);

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Error on each step", () => {
    cy.formNextStep();
    cy.field("name").hasError("Required");
    cy.field("name").fill("John");
    cy.formNextStep();

    cy.wait(2000);

    cy.formNextStep();
    cy.field("name").hasError("Required");
    cy.field("email").fill("john@company.com");
    cy.formNextStep();

    cy.wait(2000);

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Set field error", () => {
    cy.field("name").fill("John");
    cy.formNextStep();

    cy.wait(2000);

    cy.field("email").fill("john@company.com");
    cy.formNextStep();

    cy.wait(2000);

    cy.formSubmit();
    cy.field("email").hasError("You can display an error after an API call");
    cy.get('button[type="submit"]').should("be.disabled");
  });
});
