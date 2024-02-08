import { FormizProviderProps, Store } from "@/types";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { UseBoundStore, StoreApi } from "zustand";

type FormizContextValue = {
  stores: Array<UseBoundStore<StoreApi<Store>>>;
  registerStore(store: UseBoundStore<StoreApi<Store>>): void;
  unregisterStore(store: UseBoundStore<StoreApi<Store>>): void;
};

const FormizContext = createContext<FormizContextValue>({
  stores: [],
  registerStore: () => {},
  unregisterStore: () => {},
});

export const useFormizContext = () => {
  const formizContext = useContext(FormizContext);

  if (!formizContext) {
    throw new Error("No FormizContext set, use FormizProvider to set one");
  }

  return formizContext;
};

export const FormizProvider = ({ children }: FormizProviderProps) => {
  const [stores, setStores] = useState<Array<UseBoundStore<StoreApi<Store>>>>(
    []
  );
  const contextValue = useMemo(() => {
    const value: FormizContextValue = {
      stores,
      registerStore: (newStore) =>
        setStores((currentStores) => [...currentStores, newStore]),
      unregisterStore: (store) =>
        setStores((currentStores) =>
          currentStores.filter(
            (s) => s.getState().form.id !== store.getState().form.id
          )
        ),
    };
    return value;
  }, [stores]);

  return (
    <FormizContext.Provider value={contextValue}>
      {children}
    </FormizContext.Provider>
  );
};
