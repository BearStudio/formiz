import cases from "jest-in-case";
import { renderUseField } from "@/tests/__utils";
import { waitFor } from "@testing-library/react";

describe("useField: formatValue", () => {
  it("Should format the default value", async () => {
    const { result } = renderUseField({
      name: "field1",
      formatValue: (v: any) => `__${v}__`,
      defaultValue: "default value",
    });
    expect(result.current.value).toBe("default value");
    expect(result.current.formattedValue).toBe(`__default value__`);
  });

  it("Should format the value by default without default value (null)", async () => {
    const { result } = renderUseField({
      name: "field1",
      formatValue: (v: any) => `__${v}__`,
    });
    expect(result.current.value).toBe(null);
    expect(result.current.formattedValue).toBe(`__null__`);
  });

  cases(
    "Should format new value",
    async ({ formatValue = (v: any) => `__${v}__`, newValue }) => {
      const { result } = renderUseField({
        name: "field1",
        formatValue,
      });
      await waitFor(() => {
        result.current.setValue(newValue);
      });
      await waitFor(() => {
        expect(result.current.value).toStrictEqual(newValue);
      });
    },
    {
      null: { newValue: null },
      undefined: { newValue: null },
      string: { newValue: "new value" },
      "empty string": { newValue: "" },
      integer: { newValue: 22 },
      float: { newValue: 2.2 },
      zero: { newValue: 0 },
      array: { newValue: [1, 2, 3] },
      "empty array": { newValue: [] },
      "array with map": {
        newValue: [1, 2, 3],
        formatValue: (v: any) => v?.map((x: any) => x + 1),
      },
      object: { newValue: { a: 1, b: 2, c: 3 } },
      "empty object": { newValue: {} },
    }
  );
});
