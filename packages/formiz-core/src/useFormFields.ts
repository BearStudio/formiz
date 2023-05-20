import { deepEqual } from "fast-equals";
import { StoreApi, UseBoundStore } from "zustand";

import { useFormStore } from "./Formiz";
import { fieldExternalInterfaceSelector } from "./selectors";
import { ExposedExternalFieldState, Store } from "./types";
import { getFormFields } from "./utils/form";

type useFormFieldsProps = {
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  fields?: string[];
  selector?: (field: ExposedExternalFieldState<unknown>) => unknown;
};

export const useFormFields = ({
  connect,
  fields,
  selector,
}: useFormFieldsProps = {}) => {
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
    return getFormFields<any>(flatFields);
  }, deepEqual);
  return statefields;
};
