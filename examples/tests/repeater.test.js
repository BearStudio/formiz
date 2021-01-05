Feature('repeater');

Before(({ I }) => {
  I.amOnPage('/repeater');
  I.seePageTitle('Repeater');
});

Scenario('Simple Case', ({ I }) => {
  I.fill('collection[1].name', 'John');

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Add item after', ({ I }) => {
  I.fill('collection[1].name', 'John');

  I.click('Add member');
  I.seeFieldValue('collection[1].name', 'John');

  I.submitForm();
  I.seeFieldError('collection[2].name', 'Required');

  I.fill('collection[2].name', 'Doe');
  I.seeFieldValue('collection[2].name', 'Doe');

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Add item between', ({ I }) => {
  I.fill('collection[1].name', 'John');

  I.click('[aria-label="Add"]');
  I.seeFieldValue('collection[1].name', '');
  I.seeFieldValue('collection[2].name', 'John');

  I.fill('collection[1].name', 'Doe');
  I.seeFieldValue('collection[1].name', 'Doe');
  I.seeFieldValue('collection[2].name', 'John');
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
  I.fill('collection[1].name', 'John');
  I.fill('collection[2].name', 'Doe');

  I.click('[aria-label="Delete"]', '[data-test="repeater-item[2]"]');
  I.seeFieldValue('collection[1].name', 'John');
});

Scenario('Remove item between', ({ I }) => {
  I.click('Add member');
  I.fill('collection[1].name', 'John');
  I.fill('collection[2].name', 'Doe');

  I.click('[aria-label="Delete"]', '[data-test="repeater-item[1]"]');
  I.seeFieldValue('collection[1].name', 'Doe');
});

Scenario('Initial values', ({ I }) => {
  I.seeFieldValue('collection[0].name', 'Default name');
  I.seeFieldValue('collection[0].company', 'Initial Company (1)');
  I.seeFieldValue('collection[1].name', 'Initial Name (2)');
  I.seeFieldValue('collection[1].company', 'Initial Company (2)');

  I.fill('collection[0].name', 'To reset');
  I.fill('collection[0].company', 'To reset');
  I.fill('collection[1].name', 'To reset');
  I.fill('collection[1].company', 'To reset');

  I.click('Reset form');

  I.seeFieldValue('collection[0].name', 'Default name');
  I.seeFieldValue('collection[0].company', 'Initial Company (1)');
  I.seeFieldValue('collection[1].name', 'Initial Name (2)');
  I.seeFieldValue('collection[1].company', 'Initial Company (2)');
});
