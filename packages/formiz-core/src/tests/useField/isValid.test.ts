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
      defaultValue: "something",
      validations: [
        {
          handler: (v) => v === "else",
        },
      ],
    });
    expect(result.current.isValid).toBe(false);
  });

  it("Should be invalid if one async validation is false", async () => {
    const { result } = renderUseField({
      name: "field1",
      defaultValue: "something",
      validationsAsync: [
        {
          handler: async (v) => v === "else",
        },
      ],
    });
    await waitFor(() => {
      expect(result.current.isValid).toBe(false);
    });
  });
});
