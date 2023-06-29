import { isRequired } from "../index";

describe("isRequired", () => {
  // Empty

  it("Test if value is null", () => {
    expect(isRequired()(null)).toBe(false);
  });

  it("Test if value is undefined", () => {
    expect(isRequired()(undefined)).toBe(false);
  });

  it("Test if value is an empty string", () => {
    expect(isRequired()("")).toBe(false);
  });

  // Strings

  it("Test if value is a string", () => {
    expect(isRequired()("value")).toBe(true);
  });

  it("Test if value is a string with only spaces", () => {
    expect(isRequired()("   ")).toBe(false);
  });

  // Numbers

  it("Test if value is a number", () => {
    expect(isRequired()(1)).toBe(true);
  });

  it("Test if value is zero", () => {
    expect(isRequired()(0)).toBe(true);
  });

  it("Test if value is NaN", () => {
    expect(isRequired()(NaN)).toBe(false);
  });

  // Arrays

  it("Test if value is an array", () => {
    expect(isRequired()(["a", 2, {}])).toBe(true);
  });

  it("Test if value is an empty array", () => {
    expect(isRequired()([])).toBe(true);
  });

  // Objects

  it("Test if value is a object", () => {
    expect(isRequired()({ a: 1, b: 2 })).toBe(true);
  });

  it("Test if value is an empty object", () => {
    expect(isRequired()({})).toBe(true);
  });
});
