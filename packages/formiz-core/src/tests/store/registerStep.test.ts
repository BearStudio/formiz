import { createStore } from "../../store";

describe("registerStep", () => {
  it("Should register one step", () => {
    const store = createStore();
    const { registerStep } = store.getState().actions;

    registerStep("step1");

    expect(store.getState().form.currentStepName).toBe("step1");
    expect(store.getState().steps[0]).toHaveProperty("name", "step1");
  });

  it("Should register multi steps in order", () => {
    const store = createStore();
    const { registerStep } = store.getState().actions;

    registerStep("step1");
    registerStep("step2");
    registerStep("step3");

    expect(store.getState().form.currentStepName).toBe("step1");
    expect(store.getState().steps[0]).toHaveProperty("name", "step1");
    expect(store.getState().steps[1]).toHaveProperty("name", "step2");
    expect(store.getState().steps[2]).toHaveProperty("name", "step3");
  });
});
