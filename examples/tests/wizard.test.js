Feature('wizard');

Before(({ I }) => {
  I.amOnPage('/wizard');
  I.seePageTitle('Wizard');
});

Scenario('Simple Case', ({ I }) => {
  I.fill('name', 'John');
  I.goNextStep();

  I.wait(1);

  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.wait(1);

  I.submitForm();

  I.wait(1);

  I.seeFormSuccess();
});

Scenario('Error on each step', ({ I }) => {
  I.goNextStep();
  I.seeFieldError('name', 'Required');
  I.fill('name', 'John');
  I.goNextStep();

  I.wait(1);

  I.goNextStep();
  I.seeFieldError('email', 'Required');
  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.wait(1);

  I.submitForm();

  I.wait(1);

  I.seeFormSuccess();
});

Scenario('invalidateFields()', ({ I }) => {
  I.fill('name', 'John');
  I.goNextStep();

  I.wait(1);

  I.fill('email', 'john@company.com');
  I.goNextStep();

  I.wait(1);

  I.submitForm();

  I.wait(1);

  I.seeFieldError('name', 'You can display an error after an API call');
  I.seeElement('button[type="submit"][disabled]');
});
