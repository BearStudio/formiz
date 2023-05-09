import { StoreApi, UseBoundStore } from "zustand";

import type { FormizProps, Store } from "@/types";
import { createContext } from "@/utils/context";
import { ERROR_FORMIZ_MISSING_CONNECT } from "@/errors";
import { FormizDebug } from "@/FormizDebug";

export const [FormContextProvider, useFormStore] = createContext<{
  useStore: UseBoundStore<StoreApi<Store>>;
}>({
  strict: false,
  name: "FormContext",
});

export const Formiz = ({
  children,
  connect,
  autoForm,
  debug = true,
}: FormizProps) => {
  const useStore = connect?.__connect;

  if (!useStore) {
    throw new Error(ERROR_FORMIZ_MISSING_CONNECT);
  }

  const actions = useStore?.((state) => state.actions);

  const formId = useStore?.((state) => state.form.id);

  return (
    <FormContextProvider
      value={{
        useStore: useStore as UseBoundStore<StoreApi<Store>>,
      }}
    >
      <>
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
        {debug && <FormizDebug store={useStore} />}
      </>
    </FormContextProvider>
  );
};
