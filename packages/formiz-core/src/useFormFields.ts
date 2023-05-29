import { deepEqual } from "fast-equals";
import { StoreApi, UseBoundStore } from "zustand";

import { useFormStore } from "./Formiz";
import { fieldExternalInterfaceSelector } from "./selectors";
import { ExposedExternalFieldState, Store } from "./types";
import { getFormFields } from "./utils/form";

type useFormFieldsProps<
  Fields extends readonly string[] | undefined = undefined,
  Selection extends
    | keyof ExposedExternalFieldState<any>
    | ((field: ExposedExternalFieldState<any>) => any) = never
> = {
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  fields?: Fields;
  selector?: Selection;
};

type ConvertType<
  T extends string,
  Output = any
> = T extends `${infer A extends ""}`
  ? Output
  : T extends `${infer A extends string}[${infer Index}]${infer Rest}`
  ? ConvertType<A, { [T in Index]: ConvertType<Rest, Output> }>
  : T extends `${infer A}.${infer B}`
  ? ConvertType<A, ConvertType<B, Output>>
  : T extends `${infer A}`
  ? { [K in A]: Output }
  : any;

type SelectedFields<
  T extends readonly string[] | undefined,
  Selection
> = T extends undefined
  ? any
  : T extends [infer A extends string, ...infer Rest extends string[]]
  ? ConvertType<
      A,
      Selection extends keyof ExposedExternalFieldState<any>
        ? ExposedExternalFieldState<any>[Selection]
        : Selection
    > &
      SelectedFields<Rest, Selection>
  : T extends [infer B extends string]
  ? ConvertType<
      B,
      Selection extends keyof ExposedExternalFieldState<any>
        ? ExposedExternalFieldState<any>[Selection]
        : Selection
    >
  : {};

type ConvertReadOnlyTuple<T extends readonly any[] | undefined> =
  T extends undefined
    ? undefined
    : T extends readonly [...infer Values]
    ? [...Values]
    : never;

export const useFormFields = <
  Fields extends readonly string[] | undefined = undefined,
  Selection extends
    | keyof ExposedExternalFieldState<any>
    | ((field: ExposedExternalFieldState<any>) => any) = (
    field: ExposedExternalFieldState<any>
  ) => any
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
            ? typeof selector === "string"
              ? fieldExternalInterfaceSelector(state)(field)[
                  selector as keyof ExposedExternalFieldState<any>
                ]
              : selector(fieldExternalInterfaceSelector(state)(field))
            : fieldExternalInterfaceSelector(state)(field),
        }),
        {}
      );
    return getFormFields(flatFields);
  }, deepEqual);

  return statefields as SelectedFields<
    ConvertReadOnlyTuple<Fields>,
    Selection extends (...args: any) => any ? ReturnType<Selection> : Selection
  >;
};
