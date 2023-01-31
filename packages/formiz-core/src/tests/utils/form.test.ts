import {
  generateField,
  getFormValues,
  getFormFlatValues,
  getFieldIsValid,
  getFormIsValid,
  getFormIsPristine,
} from "../../utils/form";

describe("getFormValues", () => {
  it("Should get an empty object with no fields", () => {
    const fields = new Map();
    const values = getFormValues(fields);
    expect(values).toEqual({});
  });

  it("Should get an simple object with simple fields names", () => {
    const fields = new Map();
    fields.set("A", generateField("A", { name: "fieldA", value: "A" }));
    fields.set("B", generateField("B", { name: "fieldB", value: "B" }));
    const values = getFormValues(fields);
    expect(values).toEqual({ fieldA: "A", fieldB: "B" });
  });

  it("Should get a complex object with complex fields names", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", { name: "collection[0].fieldA", value: "A" })
    );
    fields.set("B", generateField("B", { name: "nested.fieldB", value: "B" }));
    const values = getFormValues(fields);
    expect(values).toEqual({
      collection: [{ fieldA: "A" }],
      nested: { fieldB: "B" },
    });
  });
});

describe("getFormFlatValues", () => {
  it("Should get an empty object with no fields", () => {
    const fields = new Map();
    const values = getFormFlatValues(fields);
    expect(values).toEqual({});
  });

  it("Should get an simple object with simple fields names", () => {
    const fields = new Map();
    fields.set("A", generateField("A", { name: "fieldA", value: "A" }));
    fields.set("B", generateField("B", { name: "fieldB", value: "B" }));
    const values = getFormFlatValues(fields);
    expect(values).toEqual({ fieldA: "A", fieldB: "B" });
  });

  it("Should get a complex object with complex fields names", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", { name: "collection[0].fieldA", value: "A" })
    );
    fields.set("B", generateField("B", { name: "nested.fieldB", value: "B" }));
    const values = getFormFlatValues(fields);
    expect(values).toEqual({
      "collection[0].fieldA": "A",
      "nested.fieldB": "B",
    });
  });
});

describe("getFieldIsValid", () => {
  it("Should BE valid with no errors", () => {
    const field = generateField("A", {
      name: "fieldA",
      value: undefined,
      requiredErrors: [],
      validationsErrors: [],
      validationsAsyncErrors: [],
      externalErrors: [],
    });
    expect(getFieldIsValid(field)).toBeTruthy();
  });

  it("Should NOT BE valid with validationsErrors", () => {
    const field = generateField("A", {
      name: "fieldA",
      value: undefined,
      requiredErrors: [],
      validationsErrors: ["error"],
      validationsAsyncErrors: [],
      externalErrors: [],
    });
    expect(getFieldIsValid(field)).toBeFalsy();
  });

  it("Should NOT BE valid with asyncValidationsErrors", () => {
    const field = generateField("A", {
      name: "fieldA",
      value: undefined,
      requiredErrors: [],
      validationsErrors: [],
      validationsAsyncErrors: ["error"],
      externalErrors: [],
    });
    expect(getFieldIsValid(field)).toBeFalsy();
  });

  it("Should NOT BE valid with externalErrors", () => {
    const field = generateField("A", {
      name: "fieldA",
      value: undefined,
      requiredErrors: [],
      validationsErrors: [],
      validationsAsyncErrors: [],
      externalErrors: ["error"],
    });
    expect(getFieldIsValid(field)).toBeFalsy();
  });
});

describe("getFormIsValid", () => {
  it("Should NOT BE valid if one field is invalid", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: undefined,
        validationsErrors: ["error"],
      })
    );
    fields.set(
      "B",
      generateField("B", {
        name: "fieldB",
        value: undefined,
        validationsErrors: [],
      })
    );
    expect(getFormIsValid(fields)).toBeFalsy();
  });

  it("Should NOT BE valid if all fields are invalid", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: undefined,
        validationsErrors: ["error"],
      })
    );
    fields.set(
      "B",
      generateField("B", {
        name: "fieldB",
        value: undefined,
        validationsErrors: ["error"],
      })
    );
    expect(getFormIsValid(fields)).toBeFalsy();
  });

  it("Should BE valid if all fields are valid", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: undefined,
        validationsErrors: [],
      })
    );
    fields.set(
      "B",
      generateField("B", {
        name: "fieldB",
        value: undefined,
        validationsErrors: [],
      })
    );
    expect(getFormIsValid(fields)).toBeTruthy();
  });

  it("Should BE valid with no fields", () => {
    const fields = new Map();
    expect(getFormIsValid(fields)).toBeTruthy();
  });
});

describe("getFormIsPristine", () => {
  it("Should BE pristine if all fields are pristine", () => {
    const fields = new Map();
    fields.set("A", generateField("A", { name: "fieldA", value: undefined }));
    fields.set("B", generateField("B", { name: "fieldB", value: undefined }));
    expect(getFormIsPristine(fields)).toBeTruthy();
  });

  it("Should NOT BE pristine if on field is NOT pristine", () => {
    const fields = new Map();
    fields.set("A", generateField("A", { name: "fieldA", value: undefined }));
    fields.set(
      "B",
      generateField("B", {
        name: "fieldB",
        value: undefined,
        isPristine: false,
      })
    );
    expect(getFormIsPristine(fields)).toBeFalsy();
  });

  it("Should NOT BE pristine if all fields are NOT pristine", () => {
    const fields = new Map();
    fields.set(
      "A",
      generateField("A", {
        name: "fieldA",
        value: undefined,
        isPristine: false,
      })
    );
    fields.set(
      "B",
      generateField("B", {
        name: "fieldB",
        value: undefined,
        isPristine: false,
      })
    );
    expect(getFormIsPristine(fields)).toBeFalsy();
  });

  it("Should BE pristine with no fields", () => {
    const fields = new Map();
    expect(getFormIsPristine(fields)).toBeTruthy();
  });
});
