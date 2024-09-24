import { useFormStore } from "@/Formiz";
import { formInterfaceSelector } from "@/selectors";
import { ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT } from "@/errors";
import { Store, useFormProps } from "@/types";
import { isDeepEqual } from "@/utils/global";
import { useOnCollectionsChange } from "@/useForm";

export const useFormContext = <Values extends object = any>(
  options?: Pick<useFormProps<Values>, "stateSubscription">
) => {
  const { useStore } = useFormStore() ?? {};
  if (!useStore) {
    throw new Error(ERROR_USE_FORM_CONTEXT_MISSING_CONTEXT);
  }
  useOnCollectionsChange(useStore);
  const formState = useStore?.(
    (state) =>
      formInterfaceSelector<Values>(
        state as Store<Values>,
        options?.stateSubscription
      ),
    isDeepEqual
  );
  return { ...formState };
};
