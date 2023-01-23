import { createCustomEqual } from "fast-equals";
import lodashIsFunction from "lodash/isFunction";

export const isDeepEqual = createCustomEqual(() => ({
  createIsNestedEqual: (deepEqual) => (a, b, meta) =>
    lodashIsFunction(a) && lodashIsFunction(b) ? true : deepEqual(a, b, meta),
}));

export const isObject = (x: any): boolean =>
  x && typeof x === "object" && x.constructor === Object;
