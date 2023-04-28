import { useCallback, useEffect, useRef, useMemo } from "react";
import lodashGet from "lodash/get";
import { StoreApi, UseBoundStore } from "zustand";
import { Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";
import cloneDeep from "clone-deep";

export interface UseRepeaterOptions {
  name: string;
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
}

export type UseRepeaterValues<Data = unknown> = {
  keys: string[];
  insertMultiple(index: number, data?: Partial<Data>[]): void;
  insert(index: number, data?: Partial<Data>): void;
  append(data?: Partial<Data>): void;
  prepend(data?: Partial<Data>): void;
  remove(index: number): void;
  removeMultiple(index: number[]): void;
  set(values: unknown[]): void;
  length: number;
};

/**
 * A hook for manage collection of fields
 *
 * @param name fields collection name
 * @param connect form to which connect fields collection
 */
export const useRepeater = <Data = unknown>({
  name,
  connect,
}: UseRepeaterOptions): UseRepeaterValues<Data> => {
  const { useStore: useStoreFromContext } = useFormStore() ?? {};

  if (!useStoreFromContext && !connect?.__connect) {
    throw new Error(
      "useRepeater is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__connect ?? useStoreFromContext;

  const storeActions = useStore(
    useCallback((state: Store) => state.actions, []),
    deepEqual
  );

  const { resetKey, initialValues, isReady, keys } = useStore((state) => {
    const initialValues = lodashGet(state.initialValues, name);

    if (
      (!!initialValues || initialValues === 0 || initialValues === "") &&
      !Array.isArray(initialValues)
    ) {
      console.error(
        `Formiz initial values for the field "${name}" is not an array! Fallback to an empty array.`
      );
    }

    const initialValuesArray = Array.isArray(initialValues)
      ? initialValues
      : [];

    return {
      resetKey: state.form.resetKey,
      isReady: state.ready,
      initialValues: initialValuesArray,
      keys:
        state.actions.getRepeaterKeys(name) ??
        initialValuesArray.map((_, index) => index.toString()),
    };
  });

  const repeaterActions = useMemo(
    () => ({
      setKeys: storeActions.setRepeaterKeys(name),
      set: storeActions.setRepeaterValues(name),
      insertMultiple: storeActions.insertMultipleRepeaterValues(name),
      insert: storeActions.insertRepeaterValue(name),
      prepend: storeActions.prependRepeaterValue(name),
      append: storeActions.appendRepeaterValue(name),
      removeMultiple: storeActions.removeMultipleRepeaterValues(name),
      remove: storeActions.removeRepeaterValue(name),
    }),
    [storeActions, name]
  );

  const keysRef = useRef(keys);
  const initialValueRef = useRef(initialValues);

  useEffect(() => {
    if (isReady) {
      repeaterActions.setKeys(keysRef.current);
      repeaterActions.set(cloneDeep(initialValueRef.current));
    }
  }, [isReady, resetKey, repeaterActions]);

  return {
    ...repeaterActions,
    keys,
    length: keys.length,
  };
};
