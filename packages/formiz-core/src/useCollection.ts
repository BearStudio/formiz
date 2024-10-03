import { useCallback, useEffect, useRef, useMemo, useId } from "react";
import lodashGet from "lodash/get";
import { StoreApi, UseBoundStore } from "zustand";
import { CollectionKey, SetValuesOptions, Store } from "./types";
import { useFormStore } from "./Formiz";
import { deepEqual } from "fast-equals";

export interface UseCollectionOptions {
  connect?: {
    __connect: UseBoundStore<StoreApi<Store>>;
  };
  defaultValue?: Array<unknown>;
}

export type UseCollectionValues<Data = unknown> = {
  keys: CollectionKey[];
  insertMultiple(
    index: number,
    data?: Partial<Data>[],
    options?: SetValuesOptions
  ): void;
  insert(index: number, data?: Partial<Data>, options?: SetValuesOptions): void;
  append(data?: Partial<Data>, options?: SetValuesOptions): void;
  prepend(data?: Partial<Data>, options?: SetValuesOptions): void;
  remove(index: number, options?: SetValuesOptions): void;
  removeMultiple(index: number[], options?: SetValuesOptions): void;
  set(values: unknown[], options?: SetValuesOptions): void;
  setKeys(
    keys: CollectionKey[] | ((oldKeys: CollectionKey[]) => CollectionKey[])
  ): void;
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

  const collectionId = useId();
  const collectionIdRef = useRef(collectionId);
  collectionIdRef.current = collectionId;

  const { isFormReady, keys, hasInitialValues } = useStore((state) => {
    const initialValues = lodashGet(state.initialValues, name);

    if (
      (!!initialValues || initialValues === 0 || initialValues === "") &&
      !Array.isArray(initialValues)
    ) {
      console.error(
        `Formiz initial values for the field "${name}" is not an array! Fallback to an empty array.`
      );
    }

    if (!initialValues && !!defaultValue && !Array.isArray(defaultValue)) {
      console.error(
        `Default value for the collection "${name}" is not an array! Fallback to an empty array.`
      );
    }

    const initialValuesArray = Array.isArray(initialValues)
      ? initialValues
      : Array.isArray(defaultValue)
      ? defaultValue
      : [];

    return {
      isFormReady: state.ready,
      keys: state.ready
        ? state.collections.get(collectionId)?.keys ??
          initialValuesArray.map((_, index) => index.toString())
        : [],
      hasInitialValues: Array.isArray(initialValues)
        ? !!initialValues?.length
        : false,
    };
  }, deepEqual);

  const collectionActions = useMemo(
    () => ({
      setKeys: storeActions.setCollectionKeys(collectionId),
      set: storeActions.setCollectionValues(collectionId),
      insertMultiple: storeActions.insertMultipleCollectionValues(collectionId),
      insert: storeActions.insertCollectionValue(collectionId),
      prepend: storeActions.prependCollectionValue(collectionId),
      append: storeActions.appendCollectionValue(collectionId),
      removeMultiple: storeActions.removeMultipleCollectionValues(collectionId),
      remove: storeActions.removeCollectionValue(collectionId),
    }),
    [storeActions, collectionId]
  );

  const keysRef = useRef(keys);
  keysRef.current = keys;

  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  const hasInitialValuesRef = useRef(hasInitialValues);
  hasInitialValuesRef.current = hasInitialValues;

  const unregisterTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(
    function registerCollection() {
      if (!isFormReady) {
        return () => {};
      }
      clearTimeout(unregisterTimeoutRef.current);

      if (isFormReady) {
        storeActions.registerCollection(collectionIdRef.current, {
          name,
          defaultValues: defaultValueRef.current,
        });
      }

      return () => {
        unregisterTimeoutRef.current = setTimeout(() => {
          storeActions.unregisterCollection(collectionIdRef.current);
        });
      };
    },
    [isFormReady, collectionActions, storeActions, name]
  );

  return {
    ...collectionActions,
    keys,
    length: keys.length,
  };
};
