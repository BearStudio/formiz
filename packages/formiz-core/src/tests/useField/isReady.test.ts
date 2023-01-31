import { renderUseField } from "../__utils";

describe("useField: isReady", () => {
  it("Should be true if is valid and there is no async validations or debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isReady).toBe(true);
  });

  it("Should be false if is invalid and there is no async validations or debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
      required: "Required",
    });
    expect(result.current.isReady).toBe(false);
  });

  it("Should be true if there is an async validations and no debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
    });
    expect(result.current.isReady).toBe(false);
  });

  it("Should false true if there is an async validations and some debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 5000,
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
    });
    expect(result.current.isReady).toBe(false);
  });

  it("Should be true if there is some debounce but no async validations", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 5000,
    });
    expect(result.current.isReady).toBe(true);
  });
});
