import cases from "jest-in-case";
import { renderUseField } from "@/tests/__utils";

describe("useField: defaultValue", () => {
  cases(
    "Should format new value",
    async ({ defaultValue, expectedValue = defaultValue }: any) => {
      const { result } = renderUseField({
        name: "field1",
        defaultValue,
      });
      expect(result.current.value).toBe(expectedValue);
    },
    {
      null: { defaultValue: null },
      undefined: { defaultValue: null },
      string: { defaultValue: "new value" },
      "empty string": { defaultValue: "" },
      integer: { defaultValue: 22 },
      float: { defaultValue: 2.2 },
      zero: { defaultValue: 0 },
      array: { defaultValue: [1, 2, 3] },
      "empty array": { defaultValue: [] },
      object: { defaultValue: { a: 1, b: 2, c: 3 } },
      "empty object": { defaultValue: {} },
    }
  );
});
