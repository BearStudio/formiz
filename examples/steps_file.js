/* eslint-disable func-names */

module.exports = function () {
  return actor({
    fill(name, value) {
      this.fillField(`[name="${name}"]`, value);
      this.see(`${JSON.stringify(value, null, 2)}`, '[data-test="debug"]');
    },
    seeFieldError(name, message) {
      this.see(message, `[role="group"][name="${name}"]`);
    },
    dontSeeFieldError(name, message) {
      this.dontSee(message, `[role="group"][name="${name}"]`);
    },
    seeFieldValue(name, value) {
      this.seeInField(`[name="${name}"] input`, value);
    },
    seeFormSuccess() {
      this.see('Values submitted', '[role="alert"]');
    },
    seePageTitle(title) {
      this.see(title, '[data-test="header"]');
    },
    submitForm() {
      this.click('[type="submit"]');
    },
    goNextStep() {
      this.click('[type="submit"]');
    },
  });
};
