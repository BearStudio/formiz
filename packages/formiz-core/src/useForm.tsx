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

export const useForm = <Values extends object = any>(
  formConfig?: useFormProps<Values>
) => {
  const defaultFormId = useId();

  const formConfigRef = useRef(formConfig ?? null);
  formConfigRef.current = formConfig ?? null;

  const useStoreRef = useRef<UseBoundStore<StoreApi<Store<Values>>>>();
  if (!useStoreRef.current) {
    useStoreRef.current = createStore({
      ready: formConfigRef.current?.ready === false ? false : true,
      form: {
        id: formConfigRef.current?.id ?? defaultFormId,
        currentStepName: formConfigRef.current?.initialStepName ?? null,
        initialStepName: formConfigRef.current?.initialStepName ?? null,
      },
      initialValues: cloneDeep(formConfigRef.current?.initialValues ?? {}),
      formConfigRef: formConfigRef ?? null,
    });
  }
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

  useEffect(() => {
    if (formConfig?.ready !== undefined) {
      formActions.updateReady(formConfig?.ready, formConfigRef);
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
      state.formConfigRef.current?.onValuesChange?.(
        formValues,
        formInterfaceSelector(state)
      );
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
        getFormIsProcessing(state.fields, state.ready)
      )
        return;
      const action = isValid
        ? state.formConfigRef.current?.onValid
        : state.formConfigRef.current?.onInvalid;
      action?.(formInterfaceSelector(state));
      prevIsValidRef.current = isValid;
    });
    return null;
  });
};
