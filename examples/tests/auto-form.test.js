Feature('auto-form');

Scenario('Simple Case', (I) => {
  I.amOnPage('/');
  I.seePageTitle('Auto form');

  I.fill('name', 'John');
  I.fill('email', 'john@company.com');

  I.submitForm();

  I.seeFormSuccess();
});

Scenario('Error Email', (I) => {
  I.amOnPage('/');
  I.seePageTitle('Auto form');

  I.fill('email', 'john@company');

  I.submitForm();

  I.seeFieldError('email', 'Not a valid email');
});

Scenario('Show errors', (I) => {
  I.amOnPage('/');
  I.seePageTitle('Auto form');

  I.submitForm();

  I.seeFieldError('name', 'Required');
  I.seeFieldError('email', 'Required');
});
