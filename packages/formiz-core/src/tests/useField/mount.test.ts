import {
  ERROR_USE_FIELD_MISSING_CONTEXT,
  ERROR_USE_FIELD_MISSING_NAME,
  ERROR_USE_FIELD_MISSING_PROPS,
} from "@/errors";
import { renderUseField, silent } from "@/tests/__utils";

describe("useField: Mount", () => {
  it("Should crash if a useField is used without props", async () => {
    silent(() => {
      expect(() => {
        renderUseField(undefined as any, false);
      }).toThrow(ERROR_USE_FIELD_MISSING_PROPS);
    });
  });
  it("Should crash if a useField is used without `name` property", async () => {
    silent(() => {
      expect(() => {
        renderUseField({} as any, false);
      }).toThrow(ERROR_USE_FIELD_MISSING_NAME);
    });
  });

  it("Should crash if a field is mounted outside of <Formiz> context", async () => {
    silent(() => {
      expect(() => {
        renderUseField({ name: "field1" }, false);
      }).toThrow(ERROR_USE_FIELD_MISSING_CONTEXT);
    });
  });
});
