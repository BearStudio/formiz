import { useState, useCallback, useEffect, useRef } from "react";
import lodashSet from "lodash/set";
import uniqid from "uniqid";
import { StoreApi, UseBoundStore } from "zustand";
import { Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";
import cloneDeep from "clone-deep";

type Data = unknown;

type UseRepeaterOptions = {
  name: string;
  initialValues?: Data[];
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
};

export type UseRepeaterValues = {
  keys: string[];
  insertMultiple(index: number, data?: Data[]): void;
  insert(index: number, data?: Data): void;
  append(data?: Data): void;
  prepend(data?: Data): void;
  remove(index: number): void;
  removeMultiple(index: number[]): void;
  set(values: unknown[]): void;
  length: number;
};

export const useRepeater = ({
  name,
  connect,
  initialValues = [],
}: UseRepeaterOptions): UseRepeaterValues => {
  const useStoreFromContext = useFormStore();

  if (!useStoreFromContext && !connect?.__connect) {
    throw new Error(
      "useFormFields is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__connect ?? useStoreFromContext;

  const storeActions = useStore((state) => state.actions, deepEqual);
  const resetKey = useStore((state) => state.form.resetKey);

  const [keys, setKeys] = useState<string[]>(
    initialValues.map((_, index) => String(index))
  );

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const insertMultiple = useCallback(
    (index: number, data?: Data[]): void => {
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
    [storeActions, name]
  );

  const insert = useCallback(
    (index: number, data?: Data): void => insertMultiple(index, [data]),
    [insertMultiple]
  );

  const prepend = useCallback(
    (data: Data): void => insertMultiple(0, [data]),
    [insertMultiple]
  );

  const append = useCallback(
    (data: Data): void => insertMultiple(-1, [data]),
    [insertMultiple]
  );
  const removeMultiple = useCallback((indexesToRemove: number[]) => {
    setKeys((oldKeys) => {
      const computedIndexes = indexesToRemove.map((index) =>
        index < 0 ? oldKeys.length + index : index
      );
      return oldKeys.filter((_, index) => !computedIndexes.includes(index));
    });
  }, []);

  const remove = useCallback(
    (indexToRemove: number) => {
      removeMultiple([indexToRemove]);
    },
    [removeMultiple]
  );

  const set = useCallback(
    (values: Data[]) => {
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
    [storeActions, name]
  );

  const initialValuesRef = useRef(initialValues);
  initialValuesRef.current = initialValues;
  useEffect(() => {
    if (resetKey) {
      set(cloneDeep(initialValuesRef.current));
    }
  }, [resetKey, set]);

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
