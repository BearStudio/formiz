import { useCallback, useEffect, useRef, useMemo } from "react";
import lodashGet from "lodash/get";
import { StoreApi, UseBoundStore } from "zustand";
import { Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";

export interface UseCollectionOptions {
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  defaultValue?: Array<unknown>;
}

export type UseCollectionValues<Data = unknown> = {
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
export const useCollection = <Data = unknown>(
  name: string,
  { connect, defaultValue }: UseCollectionOptions = {}
): UseCollectionValues<Data> => {
  const { useStore: useStoreFromContext } = useFormStore() ?? {};

  if (!useStoreFromContext && !connect?.__connect) {
    throw new Error(
      "useCollection is used outside of a form or without a `form` connected"
    );
  }

  const useStore = connect?.__connect ?? useStoreFromContext;

  const storeActions = useStore(
    useCallback((state: Store) => state.actions, []),
    deepEqual
  );

  const { isReady, keys, hasInitialValues } = useStore((state) => {
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
      : Array.isArray(defaultValue)
      ? defaultValue
      : [];

    return {
      isReady: state.ready,
      keys: state.ready
        ? state.actions.getCollectionKeys(name) ??
          initialValuesArray.map((_, index) => index.toString())
        : [],
      hasInitialValues: Array.isArray(initialValues)
        ? !!initialValues?.length
        : false,
    };
  });

  const collectionActions = useMemo(
    () => ({
      setKeys: storeActions.setCollectionKeys(name),
      set: storeActions.setCollectionValues(name),
      insertMultiple: storeActions.insertMultipleCollectionValues(name),
      insert: storeActions.insertCollectionValue(name),
      prepend: storeActions.prependCollectionValue(name),
      append: storeActions.appendCollectionValue(name),
      removeMultiple: storeActions.removeMultipleCollectionValues(name),
      remove: storeActions.removeCollectionValue(name),
    }),
    [storeActions, name]
  );

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  const hasInitialValuesRef = useRef(hasInitialValues);
  hasInitialValuesRef.current = hasInitialValues;

  useEffect(() => {
    if (isReady) {
      if (!hasInitialValuesRef.current && defaultValueRef.current) {
        storeActions.setDefaultValues({ [name]: defaultValueRef.current });
      }
      collectionActions.setKeys(keysRef.current);
    }
  }, [isReady, collectionActions, storeActions, name]);

  return {
    ...collectionActions,
    keys,
    length: keys.length,
  };
};
