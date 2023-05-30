import { deepEqual } from "fast-equals";

import { useFormStore } from "@/Formiz";
import { formInterfaceSelector } from "@/selectors";
import { ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT } from "@/errors";
import { Store } from "@/types";

export const useFormContext = <Values extends object = any>() => {
  const { useStore } = useFormStore() ?? {};
  if (!useStore) {
    throw new Error(ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT);
  }
  const formState = useStore?.(
    (state) => formInterfaceSelector<Values>(state as Store<Values>),
    deepEqual
  );
  return { ...formState };
};
