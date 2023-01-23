import { createStore } from "@/store";

describe("getFieldSetValue", () => {
  it("Should get the setValue function that can update the field value", () => {
    const store = createStore();
    const { registerField, getFieldSetValue } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });
    const setValue = getFieldSetValue({
      fieldId: "A",
      formatValue: (v) => v,
      onValueChange: () => {},
    });

    setValue("newValueA");

    expect(store.getState().fields.get("A")?.value).toBe("newValueA");
  });

  it("Should not failed or create a field if the ID does not exist", () => {
    const store = createStore();
    const { getFieldSetValue } = store.getState().actions;

    const setValue = getFieldSetValue({
      fieldId: "A",
      formatValue: (v) => v,
      onValueChange: () => {},
    });

    setValue("newValueA");

    expect(store.getState().fields.size).toBe(0);
  });
});
