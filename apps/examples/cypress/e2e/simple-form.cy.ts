describe("Simple Form", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.pageTitleIs("Simple Form");
  });

  it("Simple Case", () => {
    cy.field("name").fill("John");
    cy.field("email").fill("john@company.com");
    cy.field("confirmEmail").fill("john@company.com");
    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Error Email", () => {
    cy.field("email").fill("john@company");
    cy.formSubmit();
    cy.field("email").hasError("Not a valid email");
  });

  it("Show errors", () => {
    cy.formSubmit();
    cy.field("name").hasError("Required");
    cy.field("email").hasError("Required");
  });

  it("Set fields errors", () => {
    cy.field("name").fill("John");
    cy.field("email").fill("john@company.com");
    cy.field("confirmEmail").fill("john@company.com");

    cy.wait(1000);
    cy.formSubmit();

    cy.field("name").hasError("You can display an error after an API call");

    cy.get('button[type="submit"][disabled]');
  });

  it("Set fields values", () => {
    cy.field("name").fill("John");
    cy.get("button").contains("Fill with").click();

    cy.wait(1000);
    cy.field("name").hasValue("John");
    cy.field("email").hasValue("john@company.com");
  });

  it("Update validations deps", () => {
    cy.field("name").fill("John");
    cy.field("email").fill("john@company.com");
    cy.field("confirmEmail").fill("john@company.com");

    cy.wait(1000);
    cy.formSubmit();
    cy.isFormSuccess();

    cy.wait(100);

    cy.field("email").fill("update");
    cy.field("confirmEmail").hasError("Emails are not equals");
  });

  it("Reset form when field with validations deps", () => {
    cy.field("email").fill("john@company.com");
    cy.field("confirmEmail").fill("email");

    cy.get("button").contains("Reset form").click();

    cy.field("email").hasValue("");
    cy.field("confirmEmail").hasValue("");
  });
});
