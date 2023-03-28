import { useEffect, useId, useRef } from "react";

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
  formProps?: useFormProps<Values>
) => {
  const defaultFormId = useId();

  const formPropsRef = useRef(formProps ?? null);
  formPropsRef.current = formProps ?? null;

  const useStoreRef = useRef<UseBoundStore<StoreApi<Store>>>(
    createStore({
      ready: true,
      form: {
        id: formPropsRef.current?.id ?? defaultFormId,
        currentStepName: formPropsRef.current?.initialStepName ?? null,
        initialStepName: formPropsRef.current?.initialStepName ?? null,
      },
      initialValues: cloneDeep(formPropsRef.current?.initialValues ?? {}),
      formPropsRef: formPropsRef ?? null,
    })
  );
  const useStore = useStoreRef.current;

  useOnValuesChange(useStore);
  useIsValidChange(useStore);

  const formState = useStore(
    (state) => ({
      ...formInterfaceSelector(state),
      __connect: useStore,
    }),
    isDeepEqual
  );

  return formState;
};

const useOnValuesChange = (useStore?: UseBoundStore<StoreApi<Store>>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prevFormValuesRef = useRef({});
  useStore?.((state) => {
    if (!state.formPropsRef.current?.onValuesChange) {
      return null;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const formValues = getFormValues(state.fields);
      if (deepEqual(formValues, prevFormValuesRef.current)) return;
      state.formPropsRef.current?.onValuesChange?.(formValues);
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
      !state.formPropsRef.current?.onValid &&
      !state.formPropsRef.current?.onInvalid
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
        ? state.formPropsRef.current?.onValid
        : state.formPropsRef.current?.onInvalid;
      action?.();
      prevIsValidRef.current = isValid;
    });
    return null;
  });
};
