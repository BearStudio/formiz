import { waitFor } from "@testing-library/react";
import cases from "jest-in-case";
import { renderUseField } from "../__utils";

describe("useField: setValue", () => {
  cases(
    "Should update the value",
    async ({ defaultValue = null, newValue }: any) => {
      const { result } = renderUseField({
        name: "field1",
        defaultValue,
      });
      await waitFor(() => {
        result.current.setValue(newValue);
      });
      await waitFor(() => {
        expect(result.current.value).toStrictEqual(newValue);
      });
    },
    {
      "from string to null": { defaultValue: "default value", newValue: null },
      undefined: { newValue: undefined },
      string: { newValue: "new value" },
      "empty string": { newValue: "" },
      integer: { newValue: 22 },
      float: { newValue: 2.2 },
      zero: { newValue: 0 },
      array: { newValue: [1, 2, 3] },
      "empty array": { newValue: [] },
      object: { newValue: { a: 1, b: 2, c: 3 } },
      "empty object": { newValue: {} },
    }
  );

  it("useField: setValue with function", async () => {
    const { result } = renderUseField({
      name: "field1",
      defaultValue: "previousValue",
    });
    expect(result.current.value).toStrictEqual("previousValue");
    await waitFor(() => {
      result.current.setValue(
        (previousValue: any) => `${previousValue}+NewValue`
      );
    });
    await waitFor(() => {
      expect(result.current.value).toStrictEqual("previousValue+NewValue");
    });
  });
});
