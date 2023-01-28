import { create } from "zustand";
import lodashGet from "lodash/get";
import lodashOmit from "lodash/omit";
import cloneDeep from "clone-deep";

import {
  generateField,
  getField,
  getFormIsProcessing,
  getFormIsValid,
  getFormValues,
  getStepIsReady,
  isResetAllowed,
} from "@/utils/form";
import type { GetFieldSetValueOptions, Step, Store } from "@/types";

export const createStore = () =>
  create<Store>()((set, get) => ({
    connected: false,
    fields: new Map(),
    steps: [],
    form: {
      resetKey: 0,
      id: undefined,
      isSubmitted: false,
      currentStepName: null,
      initialStepName: null,
    },
    keepValues: {},
    externalValues: {},
    initialValues: {},
    formPropsRef: {
      current: {},
    },
    actions: {
      // FORM
      submitForm: (formEvent) => {
        formEvent?.preventDefault();
        set((state) => {
          return {
            form: {
              ...state.form,
              isSubmitted: true,
            },
          };
        });

        const formPropsRef = get().formPropsRef;
        const fields = get().fields;

        if (getFormIsProcessing(fields)) {
          return;
        }

        const formValues = getFormValues(fields);

        if (getFormIsValid(fields)) {
          formPropsRef.current?.onValidSubmit?.(formValues);
        } else {
          formPropsRef.current?.onInvalidSubmit?.(formValues);
        }
        formPropsRef.current?.onSubmit?.(formValues);
      },

      setValues: (newValues, { keepPristine = false } = {}) => {
        set((state) => {
          let externalValues = cloneDeep(newValues);
          state.fields.forEach((field) => {
            const newValue = lodashGet(externalValues, field.name);
            if (newValue !== undefined) {
              const { requiredErrors, validationsErrors } =
                state.actions.getFieldValidationsErrors(
                  newValue,
                  newValue,
                  field.requiredRef?.current,
                  field.validationsRef?.current
                );
              externalValues = lodashOmit(
                cloneDeep(externalValues),
                field.name
              );
              state.fields.set(field.id, {
                ...field,
                value: newValue,
                formattedValue: newValue,
                isPristine: keepPristine ? field.isPristine : false,
                externalErrors: [],
                requiredErrors,
                validationsErrors,
              });
            }
          });

          return {
            fields: state.fields,
            externalValues,
          };
        });
      },

      setErrors: (errors) => {
        set((state) => {
          state.fields.forEach((field) => {
            const error = lodashGet(errors, field.name);

            if (error !== undefined && typeof error === "string") {
              state.fields.set(field.id, {
                ...field,
                externalErrors: [error],
              });
            }
          });

          return {
            fields: state.fields,
          };
        });
      },

      reset: (resetOptions = {}) => {
        set((state) => {
          let initialValues = cloneDeep(
            state.formPropsRef.current?.initialValues
          );

          state.fields.forEach((field) => {
            initialValues = lodashOmit(initialValues, field.name);

            state.fields.set(field.id, {
              ...field,
              value: isResetAllowed("values", resetOptions)
                ? field.initialValue
                : field.value,
              formattedValue: isResetAllowed("values", resetOptions)
                ? field.initialFormattedValue
                : field.formattedValue,
              externalErrors: isResetAllowed("values", resetOptions)
                ? []
                : field.externalErrors,
              isPristine: isResetAllowed("pristine", resetOptions)
                ? true
                : field.isPristine,
              isTouched: isResetAllowed("touched", resetOptions)
                ? false
                : field.isTouched,
              isValidating: isResetAllowed("validating", resetOptions)
                ? false
                : field.isValidating,
              isDebouncing: isResetAllowed("debouncing", resetOptions)
                ? false
                : field.isDebouncing,
            });
          });

          return {
            ...state,
            form: {
              ...state.form,
              resetKey: isResetAllowed("resetKey", resetOptions)
                ? state.form.resetKey + 1
                : state.form.resetKey,
              isSubmitted: isResetAllowed("submitted", resetOptions)
                ? false
                : state.form.isSubmitted,
              currentStepName: isResetAllowed("currentStep", resetOptions)
                ? state.form.initialStepName ?? state.steps[0]?.name ?? null
                : state.form.currentStepName,
            },
            fields: state.fields,
            steps: state.steps.map((step) => ({
              ...step,
              isSubmitted: isResetAllowed("submitted", resetOptions)
                ? false
                : step.isSubmitted,
              isVisited: isResetAllowed("visited", resetOptions)
                ? false
                : step.isVisited,
            })),
            initialValues,
            externalValues: {},
            keepValues: {},
          };
        });
      },

      getFieldValidationsErrors: (
        value,
        formattedValue,
        required,
        validations
      ) => {
        // Required
        const requiredErrors =
          !!required && !formattedValue && formattedValue !== 0
            ? [required !== true ? required : undefined]
            : [];

        // Sync Validations
        const validationsErrors = (validations ?? [])
          .filter(
            (validation) =>
              (validation.checkFalsy ||
                !!formattedValue ||
                formattedValue === 0) &&
              !validation.handler(formattedValue, value)
          )
          .map(({ message }) => message);

        return { requiredErrors, validationsErrors };
      },

      // FIELDS
      registerField: (
        fieldId,
        newField,
        {
          defaultValue,
          formatValue = (v: unknown) => v,
          requiredRef,
          validationsRef,
        } = {}
      ) =>
        set((state) => {
          const oldFieldById = state.fields.get(fieldId);

          const externalValue = lodashGet(state.externalValues, newField.name);
          const externalValues = lodashOmit(
            cloneDeep(state.externalValues),
            newField.name
          );

          const keepValue = lodashGet(state.keepValues, newField.name);
          const keepValues = lodashOmit(
            cloneDeep(state.keepValues),
            newField.name
          );

          const initialValue = lodashGet(state.initialValues, newField.name);
          const initialValues = lodashOmit(
            cloneDeep(state.initialValues),
            newField.name
          );

          const getValue = () => {
            if (externalValue !== undefined) {
              return externalValue;
            }
            if (newField.value !== null) {
              return newField.value;
            }
            if (oldFieldById?.value !== undefined) {
              return oldFieldById.value;
            }
            if (keepValue !== undefined) {
              return keepValue;
            }
            if (initialValue !== undefined) {
              return initialValue;
            }
            return defaultValue;
          };

          const value = getValue() ?? null;
          const formattedValue = formatValue(value as any);

          const getNewInitialValue = () => {
            if (oldFieldById?.initialValue !== undefined) {
              return oldFieldById.initialValue;
            }
            if (initialValue !== undefined) {
              return initialValue;
            }
            return defaultValue;
          };

          const newInitialValue = getNewInitialValue() ?? null;
          const newInitialFormattedValue = formatValue(newInitialValue as any);

          const { requiredErrors, validationsErrors } =
            state.actions.getFieldValidationsErrors(
              value,
              formattedValue,
              requiredRef?.current,
              validationsRef?.current
            );

          state.fields.set(
            fieldId,
            generateField<unknown>(fieldId, {
              ...(oldFieldById ?? {}),
              ...newField,
              value,
              formattedValue,
              initialValue: newInitialValue,
              initialFormattedValue: newInitialFormattedValue,
              requiredErrors,
              validationsErrors,
              requiredRef,
              validationsRef,
            })
          );

          return {
            fields: state.fields,
            keepValues,
            externalValues,
            initialValues,
          };
        }),

      unregisterField: (fieldId, { persist } = {}) =>
        set((state) => {
          const field = state.fields.get(fieldId);

          if (!field) return {};

          if (!persist) {
            state.fields.delete(fieldId);
          }

          return {
            fields: state.fields,
            // TODO
            // keepValues: lodashSet(state.keepValues, field.name, field.value),
          };
        }),

      updateField: (fieldId, newField) =>
        set((state) => {
          const field = getField(state.fields, fieldId);

          if (!field) return {};

          state.fields.set(fieldId, {
            ...field,
            ...newField,
          });

          return {
            fields: state.fields,
          };
        }),

      getFieldSetValue:
        <Value>({
          fieldId,
          onValueChange,
          formatValue,
        }: GetFieldSetValueOptions<Value>) =>
        (newValue) => {
          set((state) => {
            const field = getField<Value>(state.fields, fieldId);

            if (!field) return {};

            const value: Value =
              typeof newValue === "function"
                ? (newValue as Function)(field.value)
                : newValue;

            const formattedValue = formatValue(value);

            // Validations
            const { requiredErrors, validationsErrors } =
              state.actions.getFieldValidationsErrors(
                value,
                formattedValue,
                field.requiredRef?.current,
                field.validationsRef?.current
              );

            state.fields.set(fieldId, {
              ...field,
              externalErrors: [],
              isPristine: false,
              value,
              formattedValue,
              requiredErrors,
              validationsErrors,
            });

            onValueChange(value, formattedValue);

            return {
              fields: state.fields,
            };
          });
        },

      getFieldSetIsTouched: (fieldId) => (isTouched) => {
        set((state) => {
          const field = getField(state.fields, fieldId);

          if (!field) return {};

          state.fields.set(fieldId, {
            ...field,
            isTouched,
          });

          return {
            fields: state.fields,
          };
        });
      },

      // STEPS
      submitStep: (formEvent) => {
        formEvent?.preventDefault();

        const currentStepName = get().form.currentStepName;
        if (!currentStepName) {
          return;
        }

        set((state) => {
          return {
            steps: state.steps.map((step) =>
              step.name !== currentStepName
                ? step
                : {
                    ...step,
                    isSubmitted: true,
                  }
            ),
          };
        });

        const fields = get().fields;

        if (!getStepIsReady(currentStepName, fields)) {
          return;
        }

        const steps = get().steps.filter((step) => step.isEnabled);
        const isLastStep = steps.at(-1)?.name === currentStepName;

        if (isLastStep) {
          get().actions.submitForm();
          return;
        }

        get().actions.goToNextStep();
      },

      registerStep: (stepName, { label, order = 0, isEnabled = true } = {}) =>
        set((state) => {
          return {
            steps: [
              ...state.steps,
              {
                name: stepName,
                label,
                isSubmitted: false,
                isVisited: false,
                order,
                isEnabled,
              },
            ].sort((stepA, stepB) => stepA.order - stepB.order),
            form: {
              ...state.form,
              currentStepName: state.form.currentStepName ?? stepName,
            },
          };
        }),

      updateStep: (stepName, newStep) => {
        set((state) => {
          return {
            steps: state.steps
              .map((step) =>
                step.name === stepName ? { ...step, ...newStep } : step
              )
              .sort((stepA, stepB) => stepA.order - stepB.order),
          };
        });
      },

      unregisterStep: (stepName) =>
        set((state) => {
          // const stepIndex = state.steps.findIndex(
          //   (step) => step.name === stepName
          // );

          // const fallbackStepName = (
          //   stepIndex > 0
          //     ? state.steps.at(stepIndex - 1)
          //     : state.steps.at(stepIndex + 1)
          // )?.name;

          return {
            steps: state.steps.filter((step) => step.name !== stepName),
            form: {
              ...state.form,
              // currentStepName: fallbackStepName ?? null,
            },
          };
        }),

      goToStep: (stepName) => {
        // Unknown step name
        if (
          !get()
            .steps.filter((step) => step.isEnabled)
            .find((step) => step.name === stepName)
        ) {
          return;
        }

        set((state) => ({
          form: {
            ...state.form,
            currentStepName: stepName,
          },
        }));
      },

      goToNextStep: () => {
        const currentStepName = get().form.currentStepName;
        const steps = get().steps.filter((step) => step.isEnabled);
        const isLastStep = steps.at(-1)?.name === currentStepName;

        if (isLastStep) {
          return;
        }

        const currentStepIndex = steps.findIndex(
          (step) => step.name === currentStepName
        );

        get().actions.goToStep(steps[currentStepIndex + 1].name);
      },

      goToPreviousStep: () => {
        const currentStepName = get().form.currentStepName;
        const steps = get().steps.filter((step) => step.isEnabled);
        const isFirstStep = steps.at(0)?.name === currentStepName;

        if (isFirstStep) {
          return;
        }

        const currentStepIndex = steps.findIndex(
          (step) => step.name === currentStepName
        );

        get().actions.goToStep(steps[currentStepIndex - 1].name);
      },
    },
  }));
