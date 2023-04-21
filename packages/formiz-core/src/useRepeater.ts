import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import uniqid from "uniqid";
import { StoreApi, UseBoundStore } from "zustand";
import { Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";
import cloneDeep from "clone-deep";
import { ERROR_USE_REPEATER_INITIAL_VALUES_NOT_ARRAY } from "@/errors";

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
    const initialValues = lodashGet(state.initialValues, name) ?? [];

    if (!Array.isArray(initialValues)) {
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

  const setKeys = useMemo(
    () => storeActions.setRepeaterKeys(name),
    [storeActions, name]
  );

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const insertMultiple = useCallback(
    (index: number, data?: Partial<Data>[]): void => {
      setKeys((oldKeys) => {
        const computedIndex = index < 0 ? oldKeys.length + 1 + index : index;
        const keysToInsert = Array.from({ length: data?.length ?? 0 }, () =>
          uniqid()
        );
        const newKeys = [
          ...(oldKeys || []).slice(0, computedIndex),
          ...keysToInsert,
          ...(oldKeys || []).slice(computedIndex),
        ];

        const newValues = [
          ...(oldKeys || []).slice(0, computedIndex).map(() => undefined),
          ...(data ?? []),
          ...(oldKeys || []).slice(computedIndex).map(() => undefined),
        ];

        setTimeout(() => {
          storeActions.setValues(lodashSet({}, name, newValues), {
            keepPristine: true,
          });
        });

        return newKeys;
      });
    },
    [storeActions, name, setKeys]
  );

  const insert = useCallback(
    (index: number, data?: Partial<Data>): void =>
      insertMultiple(index, [data ?? {}]),
    [insertMultiple]
  );

  const prepend = useCallback(
    (data: Partial<Data>): void => insertMultiple(0, [data]),
    [insertMultiple]
  );

  const append = useCallback(
    (data: Partial<Data>): void => insertMultiple(-1, [data]),
    [insertMultiple]
  );
  const removeMultiple = useCallback(
    (indexesToRemove: number[]) => {
      setKeys((oldKeys) => {
        const computedIndexes = indexesToRemove.map((index) =>
          index < 0 ? oldKeys.length + index : index
        );
        return oldKeys.filter((_, index) => !computedIndexes.includes(index));
      });
    },
    [setKeys]
  );

  const remove = useCallback(
    (indexToRemove: number) => {
      removeMultiple([indexToRemove]);
    },
    [removeMultiple]
  );

  const set = useCallback(
    (values: Partial<Data>[]) => {
      setKeys(() => {
        const newKeys = values.map((_, i) => keysRef.current[i] ?? uniqid());
        return newKeys;
      });

      setTimeout(() => {
        storeActions.setValues(lodashSet({}, name, values), {
          keepPristine: true,
        });
      });
    },
    [storeActions, name, setKeys]
  );

  const initialValueRef = useRef(initialValues);
  initialValueRef.current = initialValues;

  useEffect(() => {
    if (isReady) {
      set(cloneDeep(initialValueRef.current));
    }
  }, [isReady, resetKey, set]);

  return {
    insert,
    insertMultiple,
    append,
    prepend,
    remove,
    removeMultiple,
    keys,
    set,
    length: keys.length,
  };
};
