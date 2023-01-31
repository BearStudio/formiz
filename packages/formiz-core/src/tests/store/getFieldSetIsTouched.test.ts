import { createStore } from "../../store";

describe("getFieldSetIsTouched", () => {
  it("Should get the setIsTouched function that can update the isTouched value", () => {
    const store = createStore();
    const { registerField, getFieldSetIsTouched } = store.getState().actions;

    registerField("A", { name: "fieldA", value: "valueA" });
    const setIsTouched = getFieldSetIsTouched("A");

    setIsTouched(true);

    expect(store.getState().fields.get("A")?.isTouched).toBe(true);
  });

  it("Should not failed or create a field if the ID does not exist", () => {
    const store = createStore();
    const { getFieldSetIsTouched } = store.getState().actions;

    const setIsTouched = getFieldSetIsTouched("A");

    setIsTouched(true);

    expect(store.getState().fields.size).toBe(0);
  });
});
