import React, { useEffect, useId, useRef } from "react";

import { StoreApi, UseBoundStore } from "zustand";

import { createStore } from "@/store";
import type { FormizProps, Store } from "@/types";
import { createContext } from "@/utils/context";
import { getFormValues, getFormIsValid } from "@/utils/form";
import { deepEqual } from "fast-equals";
import cloneDeep from "clone-deep";

export const [FormContextProvider, useFormStore] = createContext<{
  useStore: UseBoundStore<StoreApi<Store>>;
  formProps: FormizProps;
}>({
  strict: false,
  name: "FormContext",
});

export const Formiz = ({ children, connect, ...formProps }: FormizProps) => {
  const defaultFormId = useId();
  const formPropsRef = useRef(formProps);
  formPropsRef.current = formProps;
  const useStoreRef = useRef<UseBoundStore<StoreApi<Store>>>();

  if (!useStoreRef.current && !connect?.__connect) {
    useStoreRef.current = createStore();
  }

  const useStore = connect?.__connect ?? useStoreRef.current;
  const actions = useStore?.((state) => state.actions);

  useEffect(() => {
    useStore?.setState((state) => {
      if (state.connected) return {};
      return {
        connected: true,
        form: {
          ...state.form,
          id: formPropsRef.current.id ?? defaultFormId,
          currentStepName:
            formPropsRef.current.initialStepName ?? state.form.currentStepName,
          initialStepName:
            formPropsRef.current.initialStepName ?? state.form.initialStepName,
        },
        initialValues: cloneDeep(formPropsRef.current.initialValues ?? {}),
        formPropsRef,
      };
    });
  }, [useStore, defaultFormId]);

  useOnValuesChange(useStore);
  useIsValidChange(useStore);

  return (
    <FormContextProvider
      value={{
        useStore: useStore as UseBoundStore<StoreApi<Store>>,
        formProps,
      }}
    >
      {formProps.autoForm ? (
        <form
          id={formPropsRef.current.id ?? defaultFormId}
          noValidate
          onSubmit={
            formProps.autoForm === "step"
              ? actions?.submitStep
              : actions?.submitForm
          }
        >
          {children}
        </form>
      ) : (
        children
      )}
    </FormContextProvider>
  );
};

const useOnValuesChange = (useStore?: UseBoundStore<StoreApi<Store>>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const prevFormValuesRef = useRef({});
  useStore?.((state) => {
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
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const isValid = getFormIsValid(state.fields);
      if (isValid === prevIsValidRef.current) return;
      const action = isValid
        ? state.formPropsRef.current?.onValid
        : state.formPropsRef.current?.onInvalid;
      action?.();
      prevIsValidRef.current = isValid;
    });
    return null;
  });
};
