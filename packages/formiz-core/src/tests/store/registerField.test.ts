import { createStore } from "@/store";
import { getFormValues } from "@/utils/form";

describe("registerField", () => {
  it("Should register a field with no value", () => {
    const store = createStore();
    const { registerField } = store.getState().actions;

    registerField("A", { name: "fieldA" });

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({ fieldA: null });
  });

  it("Should register a field with a value", () => {
    const store = createStore();
    const { registerField } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({ fieldA: "valueA" });
  });

  it("Should NOT register multiple fields with the SAME name", () => {
    const store = createStore();
    const { registerField } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });
    registerField("B", { name: "fieldA", value: "newValueA" });

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({ fieldA: "newValueA" });
  });

  it("Should register multiple fields with DIFFERENT names", () => {
    const store = createStore();
    const { registerField } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "A" });
    registerField("B", { name: "fieldB", value: "B" });

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({ fieldA: "A", fieldB: "B" });
  });
});
