import { createStore } from "@/store";
import { getFormValues } from "@/utils/form";

describe("updateField", () => {
  it("Should update the field value", () => {
    const store = createStore();
    const { registerField, updateField } = store.getState().actions;

    registerField("A", { name: "fieldA" });
    updateField("A", { formattedValue: "newValueA" });

    const values = getFormValues(store.getState().fields);

    expect(values).toHaveProperty("fieldA", "newValueA");
  });

  it("Should NOT update other fields values", () => {
    const store = createStore();
    const { registerField, updateField } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });
    registerField("B", { name: "fieldB", value: "valueB" });
    updateField("A", { formattedValue: "newValueA" });

    const values = getFormValues(store.getState().fields);
    expect(values).toHaveProperty("fieldB", "valueB");
  });

  it("Should NOT create a field if id does not exist", () => {
    const store = createStore();
    const { updateField } = store.getState().actions;

    updateField("A", { formattedValue: "newValueA" });

    const values = getFormValues(store.getState().fields);
    expect(values).toEqual({});
  });

  it("Should update the field isPristine", () => {
    const store = createStore();
    const { registerField, updateField } = store.getState().actions;

    registerField("A", { name: "fieldA" });
    updateField("A", { isPristine: false });

    expect(store.getState().fields.get("A")).toHaveProperty(
      "isPristine",
      false
    );
  });
});
