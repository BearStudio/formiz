Feature('wizard');

Scenario('Simple Case', (I) => {
  I.amOnPage('/wizard');
  I.seePageTitle('Wizard');

  I.fill('name', 'John');
  I.goNextStep();

  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Error on each step', (I) => {
  I.amOnPage('/wizard');

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
