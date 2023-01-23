import { isDeepEqual, isObject } from "@/utils/global";

export const generateUniqueId = (prefix?: string) => {
  const id = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${id}` : id;
};

describe("generateUniqueId", () => {
  it("Should generate a unique id", () => {
    const idA = generateUniqueId();
    const idB = generateUniqueId();

    expect(idA).not.toEqual(idB);
  });
  it("Should generate a unique id with a prefix", () => {
    const prefix = "prefix";
    const idA = generateUniqueId(prefix);
    const idB = generateUniqueId(prefix);

    expect(idA.startsWith(prefix + "-")).toBeTruthy();
    expect(idB.startsWith(prefix + "-")).toBeTruthy();
    expect(idA).not.toEqual(idB);
  });
});

describe("isDeepEqual", () => {
  it("Should BE equal with SAME simple object", () => {
    const isEqual = isDeepEqual(
      { a: 1, b: "b", c: true },
      { a: 1, b: "b", c: true }
    );
    expect(isEqual).toBeTruthy();
  });
  it("Should NOT BE equal with DIFFERENT simple object", () => {
    const isEqual = isDeepEqual(
      { a: 1, b: "b", c: true },
      { a: 2, b: "x", c: false }
    );
    expect(isEqual).toBeFalsy();
  });
  it("Should BE equal with SAME complex object", () => {
    const isEqual = isDeepEqual(
      { a: [0, 1, 2], b: { a: 1, b: "b", c: [0, 1, 2] } },
      { a: [0, 1, 2], b: { a: 1, b: "b", c: [0, 1, 2] } }
    );
    expect(isEqual).toBeTruthy();
  });
  it("Should NOT BE equal with DIFFERENT complex object", () => {
    const isEqual = isDeepEqual(
      { a: [0, 1, 2], b: { a: 1, b: "b", c: [0, 1, 2] } },
      { a: [0, 0, 0], b: { a: 1, b: "x", c: [1, 0, 2] } }
    );
    expect(isEqual).toBeFalsy();
  });
  it("Should BE equal with object with SAME functions", () => {
    const isEqual = isDeepEqual({ a: () => true }, { a: () => true });
    expect(isEqual).toBeTruthy();
  });
  it("Should BE equal with object with DIFFERENT functions", () => {
    const isEqual = isDeepEqual({ a: () => true }, { a: () => false });
    expect(isEqual).toBeTruthy();
  });
});

describe("isObject", () => {
  it("Should be TRUE for an OBJECT", () => {
    expect(isObject({ a: 0, b: "c" })).toBeTruthy();
  });
  it("Should be FALSE for an ARRAY", () => {
    expect(isObject([0, 1, 2])).toBeFalsy();
  });
  it("Should be FALSE for a STRING", () => {
    expect(isObject("string")).toBeFalsy();
  });
  it("Should be FALSE for a NUMBER", () => {
    expect(isObject(2)).toBeFalsy();
  });
  it("Should be FALSE for a FUNCTION", () => {
    expect(isObject(() => true)).toBeFalsy();
  });
});
