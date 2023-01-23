import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: isPristine", () => {
  it("Should be pristine if setValue has never been called", async () => {
    const { result } = renderUseField({ name: "field1" });
    expect(result.current.isPristine).toBe(true);
  });

  it("Should NOT be pristine if setValue has been called", async () => {
    const { result } = renderUseField({ name: "field1" });
    await waitFor(() => {
      result.current.setValue("new value");
    });
    await waitFor(() => {
      expect(result.current.isPristine).toBe(false);
    });
  });
});
