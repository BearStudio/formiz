Feature('auto-form');

Scenario('Simple Case', (I) => {
  I.amOnPage('/');
  I.see('Auto form', '[data-test="header"]');

  I.fillField('[name="name"]', 'John');
  I.see('"name": "John"', '[data-test="debug"]');

  I.fillField('[name="email"]', 'john@company.com');
  I.see('"email": "john@company.com"', '[data-test="debug"]');

  I.click('[type="submit"]');

  I.see('Values submitted');
});

Scenario('Error Email', (I) => {
  I.amOnPage('/');
  I.see('Auto form', '[data-test="header"]');

  I.fillField('[name="email"]', 'john@company');
  I.see('"email": "john@company"', '[data-test="debug"]');

  I.click('[type="submit"]');

  I.see('Not a valid email', '[role="group"][name="email"]');
});

Scenario('Show errors', (I) => {
  I.amOnPage('/');
  I.see('Auto form', '[data-test="header"]');

  I.click('[type="submit"]');

  I.see('Required');
  I.see('Required', '[role="group"][name="name"]');
  I.see('Required', '[role="group"][name="email"]');
  I.dontSee('Required', '[role="group"][name="company"]');
});
