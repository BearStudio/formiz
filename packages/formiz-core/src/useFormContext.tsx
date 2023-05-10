import { deepEqual } from "fast-equals";

import { useFormStore } from "@/Formiz";
import { FormInterface, formInterfaceSelector } from "@/selectors";
import { ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT } from "@/errors";

export const useFormContext = (): FormInterface => {
  const { useStore } = useFormStore() ?? {};
  if (!useStore) {
    throw new Error(ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT);
  }
  const formState = useStore?.(formInterfaceSelector, deepEqual);
  return { ...formState };
};
