describe("Collection", () => {
  beforeEach(() => {
    cy.visit("/collection");
    cy.pageTitleIs("Collection");
  });

  it("Simple Case", () => {
    cy.field("members[1].name").fill("John");
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Add item after", () => {
    cy.field("members[1].name").fill("John");

    cy.get("button").contains("Add member").click();
    cy.field("members[1].name").hasValue("John");

    cy.formSubmit();
    cy.field("members[2].name").hasError("Required");

    cy.field("members[2].name").fill("Doe");

    cy.field("members[1].name").hasValue("John");
    cy.field("members[2].name").hasValue("Doe");

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Add item between", () => {
    cy.field("members[1].name").fill("John");

    cy.get('[data-test="collection-item[0]"] [aria-label="Add"]').click();
    cy.field("members[1].name").hasValue("");
    cy.field("members[2].name").hasValue("John");

    cy.field("members[1].name").fill("Doe");

    cy.field("members[1].name").hasValue("Doe");
    cy.field("members[2].name").hasValue("John");

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Remove all items", () => {
    cy.get('[aria-label="Delete member 1"]').click();
    cy.get('[data-test="collection-item[1]').should("not.exist");

    cy.get('[aria-label="Delete member 0"]').click();
    cy.get('[data-test="collection-item[0]').should("not.exist");

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it("Remove last item", () => {
    cy.get("button").contains("Add member").click();
    cy.field("members[1].name").fill("John");
    cy.field("members[2].name").fill("Doe");

    cy.get('[aria-label="Delete member 2"]').click();
    cy.field("members[1].name").hasValue("John");
  });

  it("Remove item between", () => {
    cy.get("button").contains("Add member").click();
    cy.field("members[1].name").fill("John");
    cy.field("members[2].name").fill("Doe");

    cy.get('[aria-label="Delete member 1"]').click();
    cy.field("members[1].name").hasValue("Doe");
  });

  it("Initial values", () => {
    cy.field("members[0].name").hasValue("Default name (1)");
    cy.field("members[0].company").hasValue("Initial Company (1)");
    cy.field("members[1].name").hasValue("Initial Name (2)");
    cy.field("members[1].company").hasValue("Initial Company (2)");

    cy.field("members[0].name").fill("to reset");
    cy.field("members[0].company").fill("to reset");
    cy.field("members[1].name").fill("to reset");
    cy.field("members[1].company").fill("to reset");

    cy.get("button").contains("Reset form").click();

    cy.field("members[0].name").hasValue("Default name (1)");
    cy.field("members[0].company").hasValue("Initial Company (1)");
    cy.field("members[1].name").hasValue("Initial Name (2)");
    cy.field("members[1].company").hasValue("Initial Company (2)");

    // Check that new item don't recover already consumed initial values
    cy.get('[data-test="collection-item[0]"] [aria-label="Add"]').click();
    cy.field("members[2].name").hasValue("Initial Name (2)");
    cy.field("members[2].company").hasValue("Initial Company (2)");
    cy.field("members[1].name").hasValue("");
    cy.field("members[1].company").hasValue("Default company (2)");
  });

  it("Mounted/Unmounted collection", () => {
    cy.get("button").contains("Display").click();

    cy.field("conditioned[0]").hasValue("Initial value (1)");
    cy.field("conditioned[1]").hasValue("Initial value (2)");
    cy.field("conditioned[2]").should("not.exist");

    cy.get("button").contains("Add item").click();

    cy.field("conditioned[2]").should("exist");

    cy.get("button").contains("Hide").click();

    cy.field("conditioned[0]").should("not.exist");

    cy.get("button").contains("Display").click();

    cy.field("conditioned[0]").hasValue("Default value");
    cy.field("conditioned[1]").should("not.exist");
  });

  it("Reset with new members", () => {
    cy.field("members[0].name").hasValue("Default name (1)");
    cy.field("members[0].company").hasValue("Initial Company (1)");
    cy.field("members[1].name").hasValue("Initial Name (2)");
    cy.field("members[1].company").hasValue("Initial Company (2)");

    cy.get("button").contains("Add 3 members at index 1").click();
    cy.get("button").contains("Reset form").click();

    cy.field("members[0].name").hasValue("Default name (1)");
    cy.field("members[0].company").hasValue("Initial Company (1)");
    cy.field("members[1].name").hasValue("Initial Name (2)");
    cy.field("members[1].company").hasValue("Initial Company (2)");
  });

  it("Managed from form collection", () => {
    cy.field("items[0]").should("not.exist");

    cy.get("button").contains("Prepend").click();
    cy.get("button").contains("Append").click();

    cy.field("items[0]").should("exist");
    cy.field("items[1]").should("exist");

    cy.get("button").contains("Remove first item").click();

    cy.field("items[1]").should("not.exist");

    cy.get("button").contains("Set 3 items").click();

    cy.field("items[0]").should("exist");
    cy.field("items[1]").should("exist");
    cy.field("items[2]").should("exist");
    cy.field("items[3]").should("not.exist");
  });

  it("Remove primary data collection item", () => {
    cy.get("button").contains("Display").click();

    cy.field("conditioned[0]").hasValue("Initial value (1)");
    cy.field("conditioned[1]").hasValue("Initial value (2)");
    cy.field("conditioned[2]").should("not.exist");

    cy.get("button").contains("Add item").click();
    cy.get("button").contains("Add item").click();

    cy.field("conditioned[3]").should("exist").type("new value");

    cy.get('[aria-label="Delete conditioned 2"]').click();

    cy.field("conditioned[2]").hasValue("new value");
  });
});
