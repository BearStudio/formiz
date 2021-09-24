describe('Repeater', () => {
  beforeEach(() => {
    cy.visit('/repeater');
    cy.pageTitleIs('Repeater');
  });

  it('Simple Case', () => {
    cy.field('members[1].name').fill('John');
    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Add item after', () => {
    cy.field('members[1].name').fill('John');

    cy.get('button').contains('Add member').click();
    cy.field('members[1].name').hasValue('John');

    cy.formSubmit();
    cy.field('members[2].name').hasError('Required');

    cy.field('members[2].name').fill('Doe');

    cy.field('members[1].name').hasValue('John');
    cy.field('members[2].name').hasValue('Doe');

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Add item between', () => {
    cy.field('members[1].name').fill('John');

    cy.get('[data-test="repeater-item[0]"] [aria-label="Add"]').click();
    cy.field('members[1].name').hasValue('');
    cy.field('members[2].name').hasValue('John');

    cy.field('members[1].name').fill('Doe');

    cy.field('members[1].name').hasValue('Doe');
    cy.field('members[2].name').hasValue('John');

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Remove all items', () => {
    cy.get('[data-test="repeater-item[1]"] [aria-label="Delete"]').click();
    cy.get('[data-test="repeater-item[1]').should('not.exist');

    cy.get('[data-test="repeater-item[0]"] [aria-label="Delete"]').click();
    cy.get('[data-test="repeater-item[0]').should('not.exist');

    cy.formSubmit();
    cy.isFormSuccess();
  });

  it('Remove last item', () => {
    cy.get('button').contains('Add member').click();
    cy.field('members[1].name').fill('John');
    cy.field('members[2].name').fill('Doe');

    cy.get('[data-test="repeater-item[2]"] [aria-label="Delete"]').click();
    cy.field('members[1].name').hasValue('John');
  });

  it('Remove item between', () => {
    cy.get('button').contains('Add member').click();
    cy.field('members[1].name').fill('John');
    cy.field('members[2].name').fill('Doe');

    cy.get('[data-test="repeater-item[1]"] [aria-label="Delete"]').click();
    cy.field('members[1].name').hasValue('Doe');
  });

  it('Initial values', () => {
    cy.field('members[0].name').hasValue('Default name');
    cy.field('members[0].company').hasValue('Initial Company (1)');
    cy.field('members[1].name').hasValue('Initial Name (2)');
    cy.field('members[1].company').hasValue('Initial Company (2)');

    cy.field('members[0].name').fill('to reset');
    cy.field('members[0].company').fill('to reset');
    cy.field('members[1].name').fill('to reset');
    cy.field('members[1].company').fill('to reset');

    cy.get('button').contains('Reset form').click();

    cy.field('members[0].name').hasValue('Default name');
    cy.field('members[0].company').hasValue('Initial Company (1)');
    cy.field('members[1].name').hasValue('Initial Name (2)');
    cy.field('members[1].company').hasValue('Initial Company (2)');
  });
});
