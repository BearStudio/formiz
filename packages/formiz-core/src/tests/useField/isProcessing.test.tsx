import { FieldInputTest, renderUseField, Wrapper } from "@/tests/__utils";
import { render } from "@testing-library/react";

describe("useField: isProcessing", () => {
  it("Should be false if there is no async validations and no debounce", async () => {
    const { result } = renderUseField({
      name: "field1",
    });
    expect(result.current.isProcessing).toBe(false);
  });

  it("Should be true if there is an async validations and no debounce", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isProcessing"
          onStateChange={spy}
          validationsAsync={[{ handler: async (v) => !!v }]}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it("Should be true if there is an async validations and some debounce", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isProcessing"
          onStateChange={spy}
          debounceValidationsAsync={5000}
          validationsAsync={[{ handler: async (v) => !!v }]}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, true);
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it("Should be false if there is no async validations but some debounce", async () => {
    const spy = jest.fn();
    render(
      <Wrapper>
        <FieldInputTest
          name="test"
          stateToTest="isProcessing"
          onStateChange={spy}
          debounceValidationsAsync={5000}
        />
      </Wrapper>
    );

    expect(spy).toHaveBeenNthCalledWith(1, false);
    expect(spy).toHaveBeenLastCalledWith(false);
  });
});
