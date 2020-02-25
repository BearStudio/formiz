Feature('auto-form');

Scenario('OK run', (I) => {
  I.amOnPage('/');
  I.see('Auto form');

  I.fillField('[name="name"]', 'John');
  I.see('"name": "John"');

  I.fillField('[name="email"]', 'john@company.com');
  I.see('"email": "john@company.com"');

  I.click('[type="submit"]');
  I.see('Values submitted');
});
