import { FieldInputTest, renderUseField, Wrapper } from "@/tests/__utils";
import { render, waitFor } from "@testing-library/react";

describe("useField: isDebouncing", () => {
  it("Should be false if there is no debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isDebouncing).toBe(false);
  });

  it("Should be true if there is a debounce even if setValue has not been called", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isDebouncing"
          onStateChange={spy}
          debounceValidationsAsync={5000}
          validationsAsync={[{ handler: async (v) => !!v }]}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenLastCalledWith(false);
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
