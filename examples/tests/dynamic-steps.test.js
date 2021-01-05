Feature('dynamic steps');

Before(({ I }) => {
  I.amOnPage('/dynamic-steps');
  I.seePageTitle('Dynamic Steps');
});

Scenario('Simple Case', ({ I }) => {
  I.see('1 / 4');
  I.goNextStep();
  I.goNextStep();
  I.goNextStep();
  I.fill('end', 'end');
  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Increment steps', ({ I }) => {
  I.see('1 / 4');
  I.fill('count', 3);
  I.see('1 / 5');
  I.goNextStep();
  I.goNextStep();
  I.goNextStep();
  I.goNextStep();
  I.fill('end', 'end');
  I.submitForm();
  I.seeFormSuccess();
});

Scenario('Decrement steps', ({ I }) => {
  I.see('1 / 4');
  I.fill('count', 1);
  I.see('1 / 3');
  I.goNextStep();
  I.goNextStep();
  I.fill('end', 'end');
  I.submitForm();
  I.seeFormSuccess();
});
