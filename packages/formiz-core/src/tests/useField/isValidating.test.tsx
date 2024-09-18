import { renderUseField, FieldInputTest, Wrapper } from "@/tests/__utils";
import { act, render, waitFor } from "@testing-library/react";

describe("useField: isValidating", () => {
  it("Should be false if there is no async validations", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isValidating).toBe(false);
  });

  it("Should be true if there is an ongoing async validation", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isValidating"
          onStateChange={spy}
          debounceValidationsAsync={0}
          validationsAsync={[{ handler: async (v) => !!v }]}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it("Should be false after all async validations", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isValidating"
          onStateChange={spy}
          debounceValidationsAsync={0}
          validationsAsync={[{ handler: async (v) => !!v }]}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenLastCalledWith(false);
  });
});
