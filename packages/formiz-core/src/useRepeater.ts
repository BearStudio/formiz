import { useState, useCallback, useEffect, useRef } from "react";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import uniqid from "uniqid";
import { StoreApi, UseBoundStore } from "zustand";
import { Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";
import cloneDeep from "clone-deep";
import { ERROR_USE_REPEATER_INITIAL_VALUES_NOT_ARRAY } from "@/errors";

type UseRepeaterOptions<Data = unknown> = {
  name: string;
} & (
  | {
      connect: {
        __connect: UseBoundStore<StoreApi<Store>>;
      };
      initialValues: Data[];
    }
  | {
      connect?: never;
      initialValues?: never;
    }
);

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
 * @param initialValues initial collection value (⚠️ to set only if you connect a form, otherwise it's define automatically)
 */
export const useRepeater = <Data = unknown>({
  name,
  connect,
  initialValues = [],
}: UseRepeaterOptions<Data>): UseRepeaterValues<Data> => {
  const { useStore: useStoreFromContext, formProps: formPropsFromContext } =
    useFormStore() ?? {};

  if (!useStoreFromContext && !connect?.__connect) {
    throw new Error(
      "useFormFields is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__connect ?? useStoreFromContext;

  const storeActions = useStore((state) => state.actions, deepEqual);

  const { resetKey } = useStore((state) => ({
    resetKey: state.form.resetKey,
  }));

  const collectionInitialValues = !!connect?.__connect
    ? initialValues
    : ((lodashGet(formPropsFromContext.initialValues, name) ??
        []) as unknown[]);

  if (!Array.isArray(collectionInitialValues)) {
    throw new Error(ERROR_USE_REPEATER_INITIAL_VALUES_NOT_ARRAY);
  }

  const [keys, setKeys] = useState<string[]>(
    collectionInitialValues.map((_, index) => String(index))
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
    [storeActions, name]
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
    [storeActions, name]
  );

  const initialValueRef = useRef(collectionInitialValues);
  initialValueRef.current = collectionInitialValues;

  useEffect(() => {
    set(cloneDeep(initialValueRef.current));
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
