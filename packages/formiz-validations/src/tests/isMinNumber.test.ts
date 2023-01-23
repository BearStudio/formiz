import { isMinNumber } from "../index";

describe("isMinNumber", () => {
  // Empty

  it("Test if value is null", () => {
    expect(isMinNumber(1)(null)).toBe(true);
  });

  it("Test if value is undefined", () => {
    expect(isMinNumber(1)(undefined)).toBe(true);
  });

  it("Test if value is an empty string", () => {
    expect(isMinNumber(1)("")).toBe(true);
  });

  // Strings

  it("Test if value is a string", () => {
    expect(isMinNumber(1)("value")).toBe(false);
  });

  it("Test if value is a string with only spaces", () => {
    expect(isMinNumber(1)("   ")).toBe(false);
  });

  // Numbers as strings

  it("Test if value is a number string equal min", () => {
    expect(isMinNumber(1)("1")).toBe(true);
  });

  it("Test if value is a number string over min", () => {
    expect(isMinNumber(1)("2")).toBe(true);
  });

  it("Test if value is a negative number string under min", () => {
    expect(isMinNumber(1)("-1")).toBe(false);
  });

  it("Test if value is a float number string under min", () => {
    expect(isMinNumber(1)("0.99")).toBe(false);
  });

  it("Test if value is a float number string over min", () => {
    expect(isMinNumber(1)("1.01")).toBe(true);
  });

  it("Test if value is a wrong float number string", () => {
    expect(isMinNumber(1)("0.99.99")).toBe(false);
  });

  // Numbers

  it("Test if value is a number equal min", () => {
    expect(isMinNumber(1)(1)).toBe(true);
  });

  it("Test if value is a number over min", () => {
    expect(isMinNumber(1)(2)).toBe(true);
  });

  it("Test if value is a negative number under min", () => {
    expect(isMinNumber(1)(-1)).toBe(false);
  });

  it("Test if value is a float under min", () => {
    expect(isMinNumber(1)(0.99)).toBe(false);
  });

  it("Test if value is a float over min", () => {
    expect(isMinNumber(1)(1.01)).toBe(true);
  });

  it("Test if value is zero under min", () => {
    expect(isMinNumber(1)(0)).toBe(false);
  });

  it("Test if value is zero over min", () => {
    expect(isMinNumber(-1)(0)).toBe(true);
  });

  it("Test if value is NaN", () => {
    expect(isMinNumber(1)(NaN)).toBe(false);
  });

  // Arrays

  it("Test if value is an array", () => {
    expect(isMinNumber(1)(["a", 2, {}])).toBe(false);
  });

  it("Test if value is an empty array", () => {
    expect(isMinNumber(1)([])).toBe(false);
  });

  // Objects

  it("Test if value is a object", () => {
    expect(isMinNumber(1)({ a: 1, b: 2 })).toBe(false);
  });

  it("Test if value is an empty object", () => {
    expect(isMinNumber(1)({})).toBe(false);
  });
});
