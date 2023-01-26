import { useRef } from "react";

import { StoreApi, UseBoundStore } from "zustand";

import { createStore } from "@/store";
import { formInterfaceSelector } from "@/selectors";

import type { Store } from "@/types";
import { isDeepEqual } from "@/utils/global";

type ExposedForm = ReturnType<typeof formInterfaceSelector> & {
  __connect: UseBoundStore<StoreApi<Store>>;
};

type UseForm = <
  Sub extends boolean | (keyof ExposedForm["state"])[]
>(options?: {
  stateSubscription?: Sub;
}) => Omit<ExposedForm, "state"> & {
  state?: Partial<ExposedForm["state"]>;
};

export const useForm: UseForm = ({ stateSubscription = true } = {}) => {
  const useStoreRef = useRef<UseBoundStore<StoreApi<Store>>>();
  if (!useStoreRef.current) {
    useStoreRef.current = createStore();
  }
  const useStore = useStoreRef.current;

  const formState = useStore((state) => {
    const exposedForm = {
      ...formInterfaceSelector(state),
      __connect: useStore,
    };

    if (stateSubscription === true) {
      return exposedForm;
    }

    if (stateSubscription === false) {
      const { state: _, ..._exposedForm } = exposedForm;
      return _exposedForm;
    }

    return {
      ...exposedForm,
      state: stateSubscription.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: exposedForm.state?.[cur],
        }),
        {} as Partial<(typeof exposedForm)["state"]>
      ),
    };
  }, isDeepEqual);

  return formState;
};
