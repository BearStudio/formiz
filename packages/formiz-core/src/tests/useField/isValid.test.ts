import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: isValid", () => {
  it("Should be valid if there is no validations", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isValid).toBe(true);
  });

  it("Should be invalid if one sync validation is false", async () => {
    const { result } = renderUseField({
      name: "field1",
      validations: [
        {
          handler: (v) => !!v,
        },
      ],
    });
    expect(result.current.isValid).toBe(false);
  });

  it("Should be invalid if one async validation is false", async () => {
    const { result } = renderUseField({
      name: "field1",
      validationsAsync: [
        {
          handler: async (v) => !!v,
        },
      ],
    });
    await waitFor(() => {
      expect(result.current.isValid).toBe(false);
    });
  });
});
