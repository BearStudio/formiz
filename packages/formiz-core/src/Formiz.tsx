import { StoreApi, UseBoundStore } from "zustand";

import type { FormizProps, Store } from "@/types";
import { createContext } from "@/utils/context";
import { ERROR_FORMIZ_MISSING_CONNECT } from "@/errors";
import { useEffect } from "react";

export const [FormContextProvider, useFormStore] = createContext<{
  useStore: UseBoundStore<StoreApi<Store>>;
}>({
  strict: false,
  name: "FormContext",
});

export const Formiz = ({ children, connect, autoForm }: FormizProps) => {
  const useStore = connect?.__connect;

  if (!useStore) {
    throw new Error(ERROR_FORMIZ_MISSING_CONNECT);
  }

  const actions = useStore?.((state) => state.actions);

  const formId = useStore?.((state) => state.form.id);

  useEffect(() => {
    actions.updateConnected(true);
    return () => {
      actions.updateConnected(false);
    };
  }, [actions]);

  return (
    <FormContextProvider
      value={{
        useStore,
      }}
    >
      {autoForm ? (
        <form
          id={formId}
          noValidate
          onSubmit={
            autoForm === "step" ? actions?.submitStep : actions?.submitForm
          }
        >
          {children}
        </form>
      ) : (
        children
      )}
    </FormContextProvider>
  );
};
