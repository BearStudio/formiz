import { createStore } from "../../store";
import { getFormValues } from "../../utils/form";

describe("unregisterField", () => {
  it("Should unregister field", () => {
    const store = createStore();
    const { registerField, unregisterField } = store.getState().actions;

    registerField("A", { name: "fieldA" });
    unregisterField("A");

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({});
  });

  it("Should unregister field and keep other fields", () => {
    const store = createStore();
    const { registerField, unregisterField } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });
    registerField("B", { name: "fieldB", value: "valueB" });
    unregisterField("A");

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({ fieldB: "valueB" });
  });
});
