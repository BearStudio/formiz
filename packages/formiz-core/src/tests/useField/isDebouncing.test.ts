import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: isDebouncing", () => {
  it("Should be false if there is no debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isDebouncing).toBe(false);
  });

  it("Should be true if there is a debounce even if setValue has not been called", async () => {
    const { result } = renderUseField({
      name: "field1",
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
      debounceValidationsAsync: 5000,
    });
    expect(result.current.isDebouncing).toBe(true);
  });

  it("Should be false if there is a debounce but no async validations and setValue has been called", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 5000,
    });

    await waitFor(() => {
      expect(result.current.isDebouncing).toBe(false);
    });

    await waitFor(() => {
      result.current.setValue("");
    });

    expect(result.current.isDebouncing).toBe(false);
  });
});
