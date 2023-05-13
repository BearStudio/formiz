import { create } from "zustand";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import lodashOmit from "lodash/omit";
import cloneDeep from "clone-deep";

import {
  generateField,
  getField,
  getFormIsProcessing,
  getFormIsValid,
  getFormValues,
  getStepIsProcessing,
  getStepIsValid,
  isResetAllowed,
} from "@/utils/form";
import type {
  Field,
  FormatValue,
  GetFieldSetValueOptions,
  Store,
  StoreInitialState,
} from "@/types";
import uniqid from "uniqid";
import { formInterfaceSelector } from "@/selectors";
import { getFieldValidationsErrors } from "@/utils/validations";

export const createStore = (defaultState?: StoreInitialState) =>
  create<Store>()((set, get) => ({
    ready: true,
    fields: new Map(),
    collections: new Map(),
    steps: [],
    keepValues: {},
    externalValues: {},
    initialValues: {},
    formConfigRef: {
      current: {},
    },
    ...defaultState,
    form: {
      resetKey: 0,
      id: undefined,
      isSubmitted: false,
      currentStepName: null,
      initialStepName: null,
      ...defaultState?.form,
    },
    actions: {
      // FORM
      setReady: (initialState) => {
        set((state) => ({
          ready: true,
          ...initialState,
          form: {
            ...state.form,
            ...initialState?.form,
          },
        }));
      },
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

        const formConfigRef = get().formConfigRef;
        const fields = get().fields;
        const formIsReady = get().ready;

        if (getFormIsProcessing(fields, formIsReady)) {
          return;
        }

        const formValues = getFormValues(fields);

        if (getFormIsValid(fields)) {
          formConfigRef.current?.onValidSubmit?.(
            formValues,
            formInterfaceSelector(get())
          );
        } else {
          formConfigRef.current?.onInvalidSubmit?.(
            formValues,
            formInterfaceSelector(get())
          );
        }
        formConfigRef.current?.onSubmit?.(
          formValues,
          formInterfaceSelector(get())
        );
      },

      setValues: (newValues, { keepPristine = false } = {}) => {
        set((state) => {
          let externalValues = cloneDeep(newValues);
          state.fields.forEach((field) => {
            const newValue = lodashGet(externalValues, field.name);
            if (newValue !== undefined) {
              const { requiredErrors, validationsErrors } =
                getFieldValidationsErrors(
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
            state.formConfigRef.current?.initialValues
          );

          if (isResetAllowed("values", resetOptions)) {
            state.collections.forEach((values, collectionName) => {
              const collectionFields: Array<Field<unknown>> = lodashGet(
                state.formConfigRef.current?.initialValues,
                collectionName
              );

              state.collections.set(
                collectionName,
                collectionFields.map(
                  (_, index) => values[index] ?? index.toString()
                )
              );
            });
          }

          state.fields.forEach((field) => {
            const initialValue: Field<unknown> = lodashGet(
              initialValues,
              field.name
            );
            initialValues = lodashOmit(initialValues, field.name);

            const formatValue = field.formatValue
              ? field.formatValue
              : (v: Field<unknown>) => v;

            const resetValue = initialValue ?? field.defaultValue;
            const resetValueFormatted = formatValue(resetValue);

            // Validations
            const { requiredErrors, validationsErrors } =
              getFieldValidationsErrors(
                resetValue,
                resetValueFormatted,
                field.requiredRef?.current,
                field.validationsRef?.current
              );

            state.fields.set(field.id, {
              ...field,
              value: isResetAllowed("values", resetOptions)
                ? resetValue
                : field.value,
              formattedValue: isResetAllowed("values", resetOptions)
                ? resetValueFormatted
                : field.formattedValue,
              externalErrors: isResetAllowed("values", resetOptions)
                ? []
                : field.externalErrors,
              requiredErrors: isResetAllowed("values", resetOptions)
                ? requiredErrors
                : field.requiredErrors,
              validationsErrors: isResetAllowed("values", resetOptions)
                ? validationsErrors
                : field.validationsErrors,
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
            collections: state.collections,
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

      resetInitialValues: () => {
        set((state) => {
          let initialValues = cloneDeep(
            state.formConfigRef.current?.initialValues
          );

          setTimeout(() => {
            state.fields.forEach((field) => {
              initialValues = lodashOmit(initialValues, field.name);
            });
          });

          return {
            initialValues,
          };
        });
      },

      // FIELDS
      registerField: (
        fieldId,
        newField,
        {
          defaultValue = null,
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

          const { requiredErrors, validationsErrors } =
            getFieldValidationsErrors(
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
              defaultValue,
              value,
              formatValue: formatValue as FormatValue<unknown, unknown>,
              formattedValue,
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

      unregisterField: (fieldId, { persist, keepValueRef } = {}) =>
        set((state) => {
          const field = state.fields.get(fieldId);

          if (!field) return {};

          if (!persist) {
            state.fields.delete(fieldId);
          }

          return {
            fields: state.fields,
            keepValues: keepValueRef?.current
              ? lodashSet(state.keepValues, field.name, field.value)
              : state.keepValues,
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
              getFieldValidationsErrors(
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
        const formIsReady = get().ready;

        if (
          getStepIsProcessing(currentStepName, fields, formIsReady) ||
          !getStepIsValid(currentStepName, fields)
        ) {
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

      setCollectionKeys: (fieldName) => (keys) => {
        set((state) => {
          get().collections.set(
            fieldName,
            typeof keys === "function"
              ? keys(get().actions.getCollectionKeys(fieldName) ?? [])
              : keys
          );
          return {
            collections: state.collections,
          };
        });
      },

      getCollectionKeys: (fieldName) => {
        return get().collections.get(fieldName);
      },

      setCollectionValues: (fieldName) => (values, options) => {
        set((state) => {
          get().actions.setValues({ [fieldName]: values }, options);
          get().actions.setCollectionKeys(fieldName)((oldKeys) =>
            values.map((_, index) => oldKeys?.[index] ?? uniqid())
          );

          return {
            collections: state.collections,
          };
        });
      },

      insertMultipleCollectionValues:
        (fieldName) =>
        (index, values, options = { keepPristine: true }) => {
          set((state) => {
            get().actions.setCollectionKeys(fieldName)((oldKeys) => {
              const computedIndex =
                index < 0 ? oldKeys.length + 1 + index : index;
              const keysToInsert = Array.from(
                { length: values?.length ?? 0 },
                () => uniqid()
              );
              const newKeys = [
                ...(oldKeys || []).slice(0, computedIndex),
                ...keysToInsert,
                ...(oldKeys || []).slice(computedIndex),
              ];

              const newValues = [
                ...(oldKeys || []).slice(0, computedIndex).map(() => undefined),
                ...(values ?? []),
                ...(oldKeys || []).slice(computedIndex).map(() => undefined),
              ];

              setTimeout(() => {
                get().actions.setValues({ [fieldName]: newValues }, options);
              });

              return newKeys;
            });
            return { collections: state.collections };
          });
        },

      insertCollectionValue: (fieldName) => (index, value, options) => {
        set((state) => {
          get().actions.insertMultipleCollectionValues(fieldName)(
            index,
            [value],
            options
          );
          return { collections: state.collections };
        });
      },

      prependCollectionValue: (fieldName) => (value, options) => {
        set((state) => {
          get().actions.insertMultipleCollectionValues(fieldName)(
            0,
            [value ?? {}],
            options
          );
          return { collections: state.collections };
        });
      },

      appendCollectionValue: (fieldName) => (value, options) => {
        set((state) => {
          get().actions.insertMultipleCollectionValues(fieldName)(
            -1,
            [value ?? {}],
            options
          );
          return { collections: state.collections };
        });
      },

      removeMultipleCollectionValues: (fieldName) => (indexes) => {
        set((state) => {
          get().actions.setCollectionKeys(fieldName)((oldKeys) => {
            const computedIndexes = indexes.map((index) =>
              index < 0 ? oldKeys.length + index : index
            );
            return oldKeys.filter(
              (_, index) => !computedIndexes.includes(index)
            );
          });
          return { collections: state.collections };
        });
      },

      removeCollectionValue: (fieldName) => (index) => {
        set((state) => {
          get().actions.removeMultipleCollectionValues(fieldName)([index]);
          return { collections: state.collections };
        });
      },
    },
  }));
