import { createStore } from "../../store";

describe("registerStep", () => {
  it("Should go to step by name", () => {
    const store = createStore();
    const { registerStep, goToStep } = store.getState().actions;

    registerStep("step1");
    registerStep("step2");
    registerStep("step3");
    registerStep("step4");

    goToStep("step3");

    expect(store.getState().form.currentStepName).toBe("step3");
  });

  it("Should not go to unknown step", () => {
    const store = createStore();
    const { registerStep, goToStep } = store.getState().actions;

    registerStep("step1");
    registerStep("step2");
    registerStep("step3");
    registerStep("step4");

    goToStep("step8");

    expect(store.getState().form.currentStepName).toBe("step1");
  });
});
