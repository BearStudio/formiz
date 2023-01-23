import { createStore } from "@/store";

describe("unregisterStep", () => {
  it("Should unregister one step", () => {
    const store = createStore();
    const { registerStep, unregisterStep } = store.getState().actions;

    registerStep("step1");
    unregisterStep("step1");

    expect(store.getState().steps.length).toBe(0);
  });

  it("Should unregister multi steps and keep order", () => {
    const store = createStore({ formId: "test" });
    const { registerStep, unregisterStep } = store.getState().actions;

    registerStep("step1");
    registerStep("step2");
    registerStep("step3");
    registerStep("step4");

    unregisterStep("step2");
    unregisterStep("step3");

    expect(store.getState().steps[0]).toHaveProperty("name", "step1");
    expect(store.getState().steps[1]).toHaveProperty("name", "step4");
  });
});
