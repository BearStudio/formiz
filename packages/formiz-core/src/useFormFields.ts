import { deepEqual } from "fast-equals";
import { StoreApi, UseBoundStore } from "zustand";

import { useFormStore } from "./Formiz";
import { fieldInterfaceSelector } from "./selectors";
import { ExposedFieldState, Store } from "./types";
import { getFormFields } from "./utils/form";

type useFormFieldsProps<Fields extends readonly string[], Selection> = {
  connect?: {
    __store: UseBoundStore<StoreApi<Store>>;
  };
  fields?: Fields;
  selector?: (field: ExposedFieldState<unknown, unknown>) => Selection;
};

export const useFormFields = <Fields extends readonly string[], Selection>({
  connect,
  fields,
  selector,
}: useFormFieldsProps<Fields, Selection> = {}): Record<
  Fields[number],
  Selection
> => {
  const useStoreFromContext = useFormStore();

  if (!useStoreFromContext && !connect?.__store) {
    throw new Error(
      "useFormFields is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__store ?? useStoreFromContext;

  const statefields = useStore((state) => {
    const flatFields: Record<string, Selection> = Array.from(
      state.fields.values()
    )
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
            ? selector(fieldInterfaceSelector(state)(field))
            : fieldInterfaceSelector(state)(field),
        }),
        {}
      );
    return getFormFields(flatFields);
  }, deepEqual);
  return statefields;
};
