import { createStore } from "../../store";
import { getFormValues } from "../../utils/form";

describe("setValues", () => {
  it("Should update the given values", () => {
    const store = createStore();
    const { setValues, registerField } = store.getState().actions;
    registerField("A", { name: "fieldA" });
    registerField("B", { name: "fieldB" });

    setValues({ fieldA: "newValueA", fieldB: "newValueB" });

    const newValues = getFormValues(store.getState().fields);
    expect(newValues).toHaveProperty("fieldA", "newValueA");
    expect(newValues).toHaveProperty("fieldB", "newValueB");
  });

  it("Should not update others values", () => {
    const store = createStore();
    const { setValues, registerField } = store.getState().actions;
    registerField("A", { name: "fieldA", value: "valueA" });
    registerField("B", { name: "fieldB", value: "valueB" });

    setValues({ fieldA: "newValueA" });

    const newValues = getFormValues(store.getState().fields);
    expect(newValues).toHaveProperty("fieldB", "valueB");
  });

  it("Should not add unregistered fields", () => {
    const store = createStore();
    const { setValues } = store.getState().actions;

    setValues({ fieldA: "newValueA" });

    const newValues = getFormValues(store.getState().fields);
    expect(newValues).toEqual({});
  });

  it("Should keep values for unregistered fields", () => {
    const store = createStore();
    const { setValues, registerField } = store.getState().actions;

    setValues({ fieldA: "newValueA" });
    registerField("A", {
      name: "fieldA",
      value: "will be overridden",
    });

    const newValues = getFormValues(store.getState().fields);
    expect(newValues).toHaveProperty("fieldA", "newValueA");
  });
});
