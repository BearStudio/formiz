import {
  useState, useCallback, useEffect, useRef,
} from 'react';
import { v4 as uuid } from 'uuid';
import lodashSet from 'lodash/set';
import type { Form } from '@formiz/core'; // eslint-disable-line

type Data = unknown;

type UseRepeaterOptions = {
  name: string;
  form: Form,
  initialValues?: Data[];
}

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
}

export const useRepeater = ({
  name, form, initialValues = [],
}: UseRepeaterOptions): UseRepeaterValues => {
  const [keys, setKeys] = useState<string[]>(initialValues.map(() => uuid()));

  const collectionToUpdateRef = useRef<unknown[] | null>(null);

  const formRef = useRef(form);
  formRef.current = form;

  const initialValuesRef = useRef(initialValues);
  initialValuesRef.current = initialValues;

  const insertMultiple = useCallback((index: number, data?: Data[]): void => {
    setKeys((oldKeys) => {
      const computedIndex = index < 0
        ? oldKeys.length + 1 + index
        : index;

      const keysToInsert = Array.from({ length: data?.length ?? 0 }, () => uuid());
      const newKeys = [
        ...(oldKeys || []).slice(0, computedIndex),
        ...keysToInsert,
        ...(oldKeys || []).slice(computedIndex),
      ];

      const dataToInsert = Array.isArray(data) ? data : [data];
      const getFromCollectionToUpdateRef = (_, localIndex) => (
        collectionToUpdateRef.current?.[localIndex]
      );
      const newValues = [
        ...(oldKeys || []).slice(0, computedIndex).map(getFromCollectionToUpdateRef),
        ...dataToInsert,
        ...(oldKeys || []).slice(computedIndex).map(getFromCollectionToUpdateRef),
      ];

      collectionToUpdateRef.current = newValues;
      return newKeys;
    });
  }, []);

  const insert = useCallback(
    (index: number, data?: Data): void => insertMultiple(index, [data]),
    [insertMultiple],
  );

  const prepend = useCallback(
    (data: Data): void => insertMultiple(0, [data]),
    [insertMultiple],
  );

  const append = useCallback(
    (data: Data): void => insertMultiple(-1, [data]),
    [insertMultiple],
  );

  const removeMultiple = useCallback((indexesToRemove: number[]) => {
    setKeys((oldKeys) => {
      const computedIndexes = indexesToRemove
        .map((index) => (index < 0 ? oldKeys.length + index : index));
      return oldKeys.filter((_, index) => !computedIndexes.includes(index));
    });
  }, []);

  const remove = useCallback((indexToRemove: number) => {
    removeMultiple([indexToRemove]);
  }, [removeMultiple]);

  const set = useCallback((values) => {
    setKeys(() => {
      const newKeys = values.map(() => uuid());
      collectionToUpdateRef.current = values;
      return newKeys;
    });
  }, []);

  useEffect(() => {
    if (form.resetKey) {
      set(initialValuesRef.current);
    }
  }, [form.resetKey, set]);

  useEffect(() => {
    if (collectionToUpdateRef.current) {
      formRef.current.setFieldsValues(lodashSet(
        {},
        name,
        collectionToUpdateRef.current,
      ));
    }
    collectionToUpdateRef.current = null;
  }, [keys, name]);

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
