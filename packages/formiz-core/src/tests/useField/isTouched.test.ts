import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: isTouched", () => {
  it("Should NOT be isTouched if setIsTouched has never been called", async () => {
    const { result } = renderUseField({ name: "field1" });
    expect(result.current.isTouched).toBe(false);
  });

  it("Should be isTouched if setIsTouched has been called with true", async () => {
    const { result } = renderUseField({ name: "field1" });
    await waitFor(() => {
      result.current.setIsTouched(true);
    });
    expect(result.current.isTouched).toBe(true);
  });
});
