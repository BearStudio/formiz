Feature('auto-form');

Before((I) => {
  I.amOnPage('/');
  I.seePageTitle('Auto form');
});

Scenario('Simple Case', (I) => {
  I.fill('name', 'John');
  I.fill('email', 'john@company.com');

  I.submitForm();

  I.seeFormSuccess();
});

Scenario('Error Email', (I) => {
  I.fill('email', 'john@company');

  I.submitForm();

  I.seeFieldError('email', 'Not a valid email');
});

Scenario('Show errors', (I) => {
  I.submitForm();

  I.seeFieldError('name', 'Required');
  I.seeFieldError('email', 'Required');
});

Scenario('invalidateFields()', (I) => {
  I.fill('name', 'John');
  I.fill('email', 'john@company.com');

  I.submitForm();

  I.seeFieldError('name', 'You can display an error after an API call');
  I.seeElement('button[type="submit"][disabled]');
});
