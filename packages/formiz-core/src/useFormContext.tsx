import { deepEqual } from "fast-equals";

import { useFormStore } from "@/Formiz";
import { FormInterface, formInterfaceSelector } from "@/selectors";
import { ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT } from "@/errors";

export const useFormContext = <
  Values extends Record<string, unknown> = Record<string, unknown>
>() => {
  const { useStore } = useFormStore() ?? {};
  if (!useStore) {
    throw new Error(ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT);
  }
  const formState = useStore?.(formInterfaceSelector, deepEqual);
  return { ...formState } as FormInterface<Values>;
};
