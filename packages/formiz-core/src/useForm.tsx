import { useCallback, useEffect, useId, useRef } from "react";

import { StoreApi, UseBoundStore } from "zustand";

import { createStore } from "@/store";
import { formInterfaceSelector } from "@/selectors";

import type { Store, useFormProps } from "@/types";
import { isDeepEqual } from "@/utils/global";
import cloneDeep from "clone-deep";
import {
  getFormIsProcessing,
  getFormIsValid,
  getFormValues,
} from "@/utils/form";
import { deepEqual } from "fast-equals";

export const useForm = <Values = unknown,>(
  formConfig?: useFormProps<Values>
) => {
  const defaultFormId = useId();

  const formConfigRef = useRef(formConfig ?? null);
  formConfigRef.current = formConfig ?? null;

  const storeDefaultState = {
    form: {
      id: formConfigRef.current?.id ?? defaultFormId,
      currentStepName: formConfigRef.current?.initialStepName ?? null,
      initialStepName: formConfigRef.current?.initialStepName ?? null,
    },
    initialValues: cloneDeep(formConfigRef.current?.initialValues ?? {}),
    formConfigRef: formConfigRef ?? null,
  };
  const storeDefaultStateRef = useRef(storeDefaultState);
  storeDefaultStateRef.current = storeDefaultState;

  const useStoreRef = useRef<UseBoundStore<StoreApi<Store>>>(
    createStore({
      ready: formConfigRef.current?.ready === false ? false : true,
      ...storeDefaultState,
    })
  );
  const useStore = useStoreRef.current;

  useOnValuesChange(useStore);
  useIsValidChange(useStore);

  const formActions = useStore(useCallback((state) => state.actions, []));

  const formState = useStore(
    (state) => ({
      ...formInterfaceSelector(state),
      __connect: useStore,
    }),
    isDeepEqual
  );

  const isReadyRef = useRef(formState.isReady);
  isReadyRef.current = formState.isReady;

  useEffect(() => {
    if (!isReadyRef.current && formConfig?.ready) {
      formActions.setReady(storeDefaultStateRef.current);
    }
  }, [formActions, formConfig?.ready]);

  return formState;
};

const useOnValuesChange = (useStore?: UseBoundStore<StoreApi<Store>>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prevFormValuesRef = useRef({});
  useStore?.((state) => {
    if (!state.formConfigRef.current?.onValuesChange) {
      return null;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const formValues = getFormValues(state.fields);
      if (deepEqual(formValues, prevFormValuesRef.current)) return;
      state.formConfigRef.current?.onValuesChange?.(formValues);
      prevFormValuesRef.current = formValues;
    });
    return null;
  });
};

const useIsValidChange = (useStore?: UseBoundStore<StoreApi<Store>>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prevIsValidRef = useRef({});
  useStore?.((state) => {
    if (
      !state.formConfigRef.current?.onValid &&
      !state.formConfigRef.current?.onInvalid
    ) {
      return null;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const isValid = getFormIsValid(state.fields);
      if (
        isValid === prevIsValidRef.current ||
        getFormIsProcessing(state.fields)
      )
        return;
      const action = isValid
        ? state.formConfigRef.current?.onValid
        : state.formConfigRef.current?.onInvalid;
      action?.();
      prevIsValidRef.current = isValid;
    });
    return null;
  });
};
