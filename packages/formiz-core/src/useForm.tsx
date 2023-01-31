import { useRef } from "react";

import { StoreApi, UseBoundStore } from "zustand";

import { createStore } from "./store";
import { formInterfaceSelector } from "./selectors";

import type { Store } from "./types";
import { isDeepEqual } from "./utils/global";

export const useForm = () => {
  const useStoreRef = useRef<UseBoundStore<StoreApi<Store>>>();
  if (!useStoreRef.current) {
    useStoreRef.current = createStore();
  }
  const useStore = useStoreRef.current;

  const formState = useStore(
    (state) => ({
      ...formInterfaceSelector(state),
      __connect: useStore,
    }),
    isDeepEqual
  );

  return formState;
};
