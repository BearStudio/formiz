import { deepEqual } from "fast-equals";

import { useFormStore } from "@/Formiz";
import { formInterfaceSelector } from "@/selectors";

export const useFormContext = () => {
  const useStore = useFormStore();
  const formState = useStore?.(formInterfaceSelector, deepEqual);
  return { ...formState } as const;
};
