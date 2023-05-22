import { deepEqual } from "fast-equals";
import { StoreApi, UseBoundStore } from "zustand";

import { useFormStore } from "./Formiz";
import { fieldExternalInterfaceSelector } from "./selectors";
import { ExposedExternalFieldState, Store } from "./types";
import { getFormFields } from "./utils/form";

type useFormFieldsProps<
  Fields extends readonly string[] | undefined = undefined,
  Selection = unknown
> = {
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  fields?: Fields;
  selector?: (field: ExposedExternalFieldState<any>) => Selection;
};

type ConvertType<
  T extends string,
  Output = unknown
> = T extends `${infer A extends ""}`
  ? Output
  : T extends `${infer A extends string}[${infer Index}]${infer Rest}`
  ? ConvertType<A, { [T in Index]: ConvertType<Rest, Output> }>
  : T extends `${infer A}.${infer B}`
  ? ConvertType<A, ConvertType<B, Output>>
  : T extends `${infer A}`
  ? { [K in A]: Output }
  : never;

type SelectedFields<
  T extends readonly string[] | undefined,
  Selection
> = T extends undefined
  ? Record<string, any>
  : T extends [infer A extends string, ...infer Rest extends string[]]
  ? ConvertType<A, Selection> & SelectedFields<Rest, Selection>
  : T extends [infer B extends string]
  ? ConvertType<B, Selection>
  : {};

type ConvertReadOnlyTuple<T extends readonly any[] | undefined> =
  T extends undefined
    ? undefined
    : T extends readonly [...infer Values]
    ? [...Values]
    : never;

export const useFormFields = <
  Fields extends readonly string[] | undefined = undefined,
  Selection = unknown
>({
  connect,
  fields,
  selector,
}: useFormFieldsProps<Fields, Selection> = {}) => {
  const { useStore: useStoreFromContext } = useFormStore() ?? {};

  if (!useStoreFromContext && !connect?.__connect) {
    throw new Error(
      "useFormFields is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__connect ?? useStoreFromContext;

  const statefields = useStore((state) => {
    const flatFields = Array.from(state.fields.values())
      .filter(
        (field) =>
          !fields ||
          fields.some(
            (name) =>
              name === field.name ||
              field.name.startsWith(`${name}[`) ||
              field.name.startsWith(`${name}.`)
          )
      )
      .reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: selector
            ? selector(fieldExternalInterfaceSelector(state)(field))
            : fieldExternalInterfaceSelector(state)(field),
        }),
        {}
      );
    return getFormFields(flatFields);
  }, deepEqual);

  return statefields as SelectedFields<ConvertReadOnlyTuple<Fields>, Selection>;
};
