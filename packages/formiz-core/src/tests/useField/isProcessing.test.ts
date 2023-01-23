import { renderUseField } from "@/tests/__utils";
import { act } from "@testing-library/react";

describe("useField: isProcessing", () => {
  it("Should be false if there is no async validations and no debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isProcessing).toBe(false);
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
    expect(result.current.isProcessing).toBe(true);
  });

  it("Should be true if there is an async validations and some debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 5000,
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
    });
    expect(result.current.isProcessing).toBe(true);
  });

  it("Should be false if there is no async validations but some debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 5000,
    });
    expect(result.current.isProcessing).toBe(false);
  });
});
