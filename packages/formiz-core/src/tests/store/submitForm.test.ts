import { createStore } from "../../store";
import { generateField } from "../../utils/form";

describe("submitForm", () => {
  it("Should update the isSubmitted value", () => {
    const store = createStore();
    const { submitForm } = store.getState().actions;
    expect(store.getState().form.isSubmitted).toBeFalsy();
    submitForm();
    expect(store.getState().form.isSubmitted).toBeTruthy();
  });

  it("Should trigger the onSubmit method", () => {
    const store = createStore();
    const { submitForm } = store.getState().actions;

    const onSubmit = jest.fn();
    const fields = new Map();
    fields.set("A", generateField("A", { name: "fieldA", value: "valueA" }));
    fields.set(
      "B",
      generateField("B", { name: "nested.fieldB", value: "valueB" })
    );

    store.setState({
      fields,
      formPropsRef: {
        current: {
          onSubmit,
        },
      },
    });

    submitForm();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      fieldA: "valueA",
      nested: { fieldB: "valueB" },
    });
  });

  it("Should not submit if on field is validating", () => {
    const store = createStore();
    const { submitForm } = store.getState().actions;

    const onSubmit = jest.fn();
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: "valueA",
        isValidating: true, // Field is validating
      })
    );

    store.setState({
      fields,
      formPropsRef: {
        current: {
          onSubmit,
        },
      },
    });

    submitForm();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Should not submit if on field is debouncing", () => {
    const store = createStore();
    const { submitForm } = store.getState().actions;

    const onSubmit = jest.fn();
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: "valueA",
        isDebouncing: true, // Field is debouncing
      })
    );

    store.setState({
      fields,
      formPropsRef: {
        current: {
          onSubmit,
        },
      },
    });

    submitForm();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
