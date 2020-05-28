Feature('wizard');

Before((I) => {
  I.amOnPage('/wizard');
  I.seePageTitle('Wizard');
});

Scenario('Simple Case', (I) => {
  I.fill('name', 'John');
  I.goNextStep();

  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Error on each step', (I) => {
  I.goNextStep();
  I.seeFieldError('name', 'Required');
  I.fill('name', 'John');
  I.goNextStep();

  I.goNextStep();
  I.seeFieldError('email', 'Required');
  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('invalidateFields()', (I) => {
  I.fill('name', 'John');
  I.goNextStep();

  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.submitForm();

  I.seeFieldError('name', 'You can display an error after an API call');
  I.seeElement('button[type="submit"][disabled]');
});
