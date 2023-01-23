import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { deepEqual } from "fast-equals";

import type { FormizStepProps } from "@/types";
import { useFormStore } from "./Formiz";

const StepContext = createContext({
  name: "",
  isStepMountedRef: { current: true },
});

export const useStepContext = () => useContext(StepContext);

// const StepRenderer = ({ children }: { children?: React.ReactNode }) => {
//   const { isStepMountedRef } = useStepContext();
//   useEffect(
//     () => () => {
//       isStepMountedRef.current = false;
//     },
//     [isStepMountedRef]
//   );
//   return <>{children}</>;
// };

export const FormizStep = ({
  as: Tag = "div",
  name,
  label,
  order,
  isEnabled = true,
  style = {},
  autoHide = true,
  ...rest
}: FormizStepProps) => {
  const isStepMountedRef = useRef(true);
  const useStore = useFormStore();
  const storeActions = useStore(
    useCallback((state) => state.actions, []),
    deepEqual
  );

  const isCurrentStep = useStore(
    useCallback(
      (state) => {
        const isCurrent = state.form.currentStepName === name;
        return isCurrent;
      },
      [name]
    )
  );

  const resetKey = useStore((state) => state.form.resetKey);

  const labelRef = useRef(label);
  labelRef.current = label;

  // Register / Unregister Step
  useEffect(() => {
    storeActions.registerStep(name, { label: labelRef.current });
    return () => storeActions.unregisterStep(name);
  }, [name, storeActions]);

  // Update Step
  useEffect(() => {
    storeActions.updateStep(name, { label });
  }, [name, label, storeActions]);

  const contextValue = useMemo(
    () => ({
      name,
      isStepMountedRef,
    }),
    [name, isStepMountedRef]
  );

  useEffect(() => {
    if (isCurrentStep) {
      storeActions.updateStep(name, { isVisited: true });
    }
  }, [name, isCurrentStep, storeActions, resetKey]);

  return (
    <StepContext.Provider value={contextValue}>
      {/* {isCurrentStep && <StepRenderer> */}
      <Tag
        style={{
          ...style,
          display: autoHide && !isCurrentStep ? "none" : undefined,
        }}
        {...rest}
      />
      {/* </StepRenderer>} */}
    </StepContext.Provider>
  );
};
