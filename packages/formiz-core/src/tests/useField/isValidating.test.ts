import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: isValidating", () => {
  it("Should be false if there is no async validations", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isValidating).toBe(false);
  });

  it("Should be true if there is an ongoing async validation", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 0,
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
    });
    expect(result.current.isValidating).toBe(true);
  });

  it("Should be false after all async validations", async () => {
    const { result } = renderUseField({
      name: "field1",
      debounceValidationsAsync: 0,
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
        {
          handler: async (v) => !!v,
        },
      ],
    });
    expect(result.current.isValidating).toBe(true);
    await waitFor(() => {
      expect(result.current.isValidating).toBe(false);
    });
  });
});
