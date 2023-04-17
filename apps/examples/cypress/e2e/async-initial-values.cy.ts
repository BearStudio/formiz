describe("Repeater", () => {
  beforeEach(() => {
    cy.visit("/async-initial-values");
    cy.pageTitleIs("Async Initial Values");
  });

  it("Await async initial values", () => {
    cy.wait(200); // To avoid hasValue("") always succeed
    cy.field("name").hasValue("");
    cy.field("name").hasValue("John Doe");
  });
});
