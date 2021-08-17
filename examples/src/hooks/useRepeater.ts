import {
  useState, useCallback, useEffect, useRef,
} from 'react';
import { v4 as uuid } from 'uuid';
import lodashSet from 'lodash/set';
import type { Form } from '@formiz/core'; // eslint-disable-line

type UseRepeaterOptions = {
  name: string;
  form: Form,
  initialValues?: any[];
}

export const useRepeater = ({
  name, form, initialValues = [],
}: UseRepeaterOptions) => {
  const [keys, setKeys] = useState<any[]>(initialValues.map(() => uuid()));

  const formRef = useRef(form);
  formRef.current = form;

  const initialValuesRef = useRef(initialValues);
  initialValuesRef.current = initialValues;

  const add = useCallback(({
    index,
    data,
  }: {
    index?: number;
    data?: Record<string, unknown>;
  } = {}) => {
    setKeys((oldKeys) => {
      const newKeys = !index && index !== 0
        ? [...oldKeys, uuid()]
        : [
          ...(oldKeys || []).slice(0, index),
          uuid(),
          ...(oldKeys || []).slice(index),
        ];

      setTimeout(() => {
        formRef.current.setFieldsValues(
          lodashSet(
            {},
            name,
            newKeys.map((_, i) => (i === (index ?? newKeys.length - 1) ? data ?? {} : {})),
          ),
          { keepUnmounted: true },
        );
      });

      return newKeys;
    });
  }, [name]);

  const remove = useCallback((index) => {
    setKeys((oldKeys) => {
      const newKeys = oldKeys.filter((_, i) => i !== index);
      return newKeys;
    });
  }, []);

  const setCollection = useCallback((values) => {
    setKeys(() => {
      const newKeys = values.map(() => uuid());
      setTimeout(() => {
        formRef.current.setFieldsValues(
          lodashSet({}, name, values),
          { keepUnmounted: true },
        );
      });
      return newKeys;
    });
  }, [name]);

  useEffect(() => {
    if (form.resetKey) {
      setCollection(initialValuesRef.current);
    }
  }, [form.resetKey, setCollection]);

  return {
    add,
    remove,
    keys,
    setCollection,
  };
};
