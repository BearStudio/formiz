Feature('repeater');

Before(({ I }) => {
  I.amOnPage('/repeater');
  I.seePageTitle('Repeater');
});

Scenario('Simple Case', ({ I }) => {
  I.fill('members[1].name', 'John');

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Add item after', ({ I }) => {
  I.fill('members[1].name', 'John');

  I.click('Add member');
  I.seeFieldValue('members[1].name', 'John');

  I.submitForm();
  I.seeFieldError('members[2].name', 'Required');

  I.fill('members[2].name', 'Doe');
  I.seeFieldValue('members[2].name', 'Doe');

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Add item between', ({ I }) => {
  I.fill('members[1].name', 'John');

  I.click('[aria-label="Add"]');
  I.seeFieldValue('members[1].name', '');
  I.seeFieldValue('members[2].name', 'John');

  I.fill('members[1].name', 'Doe');
  I.seeFieldValue('members[1].name', 'Doe');
  I.seeFieldValue('members[2].name', 'John');
});

Scenario('Remove all items', ({ I }) => {
  I.click('[aria-label="Delete"]', '[data-test="repeater-item[1]"]');
  I.dontSeeElement('[data-test="repeater-item[1]"]');

  I.click('[aria-label="Delete"]', '[data-test="repeater-item[0]"]');
  I.dontSeeElement('[data-test="repeater-item[0]"]');

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Remove last item', ({ I }) => {
  I.click('Add member');
  I.fill('members[1].name', 'John');
  I.fill('members[2].name', 'Doe');

  I.click('[aria-label="Delete"]', '[data-test="repeater-item[2]"]');
  I.seeFieldValue('members[1].name', 'John');
});

Scenario('Remove item between', ({ I }) => {
  I.click('Add member');
  I.fill('members[1].name', 'John');
  I.fill('members[2].name', 'Doe');

  I.click('[aria-label="Delete"]', '[data-test="repeater-item[1]"]');
  I.seeFieldValue('members[1].name', 'Doe');
});

Scenario('Initial values', ({ I }) => {
  I.seeFieldValue('members[0].name', 'Default name');
  I.seeFieldValue('members[0].company', 'Initial Company (1)');
  I.seeFieldValue('members[1].name', 'Initial Name (2)');
  I.seeFieldValue('members[1].company', 'Initial Company (2)');

  I.fill('members[0].name', 'To reset');
  I.fill('members[0].company', 'To reset');
  I.fill('members[1].name', 'To reset');
  I.fill('members[1].company', 'To reset');

  I.click('Reset form');

  I.seeFieldValue('members[0].name', 'Default name');
  I.seeFieldValue('members[0].company', 'Initial Company (1)');
  I.seeFieldValue('members[1].name', 'Initial Name (2)');
  I.seeFieldValue('members[1].company', 'Initial Company (2)');
});
