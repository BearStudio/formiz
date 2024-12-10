import { create } from "zustand";
import lodashSet from "lodash/set";
import lodashGet from "lodash/get";
import lodashMerge from "lodash/merge";
import cloneDeep from "clone-deep";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 19 });

import {
  generateField,
  getField,
  getFieldFirstValue,
  getFormIsProcessing,
  getFormIsValid,
  getFormValues,
  getStepIsProcessing,
  getStepIsValid,
  getValueByFieldName,
  isArrayEmpty,
  isResetAllowed,
  omitValueByFieldName,
  parseValues,
} from "@/utils/form";
import type {
  CollectionActionProps,
  DefaultFormValues,
  FormatValue,
  GetFieldSetValueOptions,
  NullablePartial,
  Store,
  StoreInitialState,
} from "@/types";
import { formInterfaceSelector } from "@/selectors";
import { getFieldValidationsErrors } from "@/utils/validations";
import { insertItemsAtIndex, removeItemsAtIndexes } from "@/utils/collection";

export const createStore = <Values extends object = DefaultFormValues>(
  defaultState?: StoreInitialState<Values>
) =>
  create<Store<Values>>()((set, get) => ({
    ready: true,
    connected: false,
    fields: new Map(),
    collections: new Map(),
    steps: [],
    keepValues: {},
    externalValues: {},
    resetDefaultValues: {},
    defaultValues: {},
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
      updateConfig: (formConfigRef) => {
        set((state) => ({
          formConfigRef,
          form: {
            ...state.form,
            id: formConfigRef.current?.id ?? state.form.id,
          },
        }));
        get().actions.reset({ exclude: ["resetKey"] });
      },
      updateReady: (ready, formConfigRef) => {
        const wasReady = get().ready;
        set(() => ({
          ready,
          formConfigRef,
        }));
        if (!wasReady && ready && get().connected) {
          get().actions.reset({ exclude: ["resetKey"] });
        }
      },
      updateConnected: (connected, connectRef) => {
        const wasConnected = get().connected;
        set(() => ({
          connected,
          formConfigRef:
            connectRef?.current?.__connect?.getState().formConfigRef,
        }));
        if (!wasConnected && connected && get().ready) {
          get().actions.reset({ exclude: ["resetKey"] });
        }
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

        const formValues = getFormValues<Values>(fields);

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
          let externalValues = parseValues(cloneDeep(newValues));
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
              externalValues =
                omitValueByFieldName(cloneDeep(externalValues), field.name) ??
                {};
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
            externalValues: lodashMerge(
              cloneDeep(state.externalValues),
              externalValues
            ),
          };
        });
      },

      setDefaultValues: (newDefaultValues) => {
        set((state) => {
          let defaultValues = cloneDeep(newDefaultValues);
          state.fields.forEach((field) => {
            const newValue = getValueByFieldName(defaultValues, field.name);
            if (newValue !== undefined) {
              const { requiredErrors, validationsErrors } =
                getFieldValidationsErrors(
                  newValue,
                  newValue,
                  field.requiredRef?.current,
                  field.validationsRef?.current
                );
              defaultValues =
                omitValueByFieldName(defaultValues, field.name) ?? {};
              state.fields.set(field.id, {
                ...field,
                value: newValue,
                formattedValue: newValue,
                externalErrors: [],
                requiredErrors,
                validationsErrors,
              });
            }
          });

          return {
            fields: state.fields,
            defaultValues: lodashMerge(
              cloneDeep(state.defaultValues),
              defaultValues
            ),
            resetDefaultValues: lodashMerge(
              cloneDeep(state.resetDefaultValues),
              newDefaultValues
            ),
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

      reset: (resetOptions) => {
        set((state) => {
          let initialValues = cloneDeep(
            state.formConfigRef.current?.initialValues
          );

          if (
            isResetAllowed("values", resetOptions) ||
            isResetAllowed("pristine", resetOptions)
          ) {
            state.collections.forEach((collection, collectionId) => {
              const collectionFields = getValueByFieldName(
                state.formConfigRef.current?.initialValues,
                collection.name
              ) as NullablePartial<Values>[];

              const storeResetDefaultValue = getValueByFieldName(
                state.resetDefaultValues,
                collection.name
              );

              const resetKeys =
                (collectionFields ?? storeResetDefaultValue)?.map(
                  (_, index) => collection.keys?.[index] ?? index.toString()
                ) ?? [];

              state.collections.set(collectionId, {
                name: collection.name,
                isPristine: isResetAllowed("pristine", resetOptions)
                  ? true
                  : state.collections.get(collectionId)?.isPristine ?? true,
                keys: isResetAllowed("values", resetOptions)
                  ? resetKeys
                  : state.collections.get(collectionId)?.keys ?? [],
              });
            });
          }

          state.fields.forEach((field) => {
            const initialValue = getValueByFieldName(initialValues, field.name);
            initialValues = omitValueByFieldName(initialValues, field.name);

            const storeResetDefaultValue = getValueByFieldName(
              state.resetDefaultValues,
              field.name
            );

            const formatValue = field.formatValue
              ? field.formatValue
              : (v: unknown) => v;

            const resetValue =
              initialValue ?? storeResetDefaultValue ?? field.defaultValue;
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
                ? state.formConfigRef.current?.initialStepName ??
                  state.steps[0]?.name ??
                  null
                : state.form.currentStepName,
              initialStepName: isResetAllowed("currentStep", resetOptions)
                ? state.formConfigRef.current?.initialStepName ??
                  state.steps[0]?.name ??
                  null
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

          const value = getFieldFirstValue({
            fieldId,
            newField,
            state,
            defaultValue,
          });

          const externalValues = omitValueByFieldName(
            state.externalValues,
            newField.name
          );
          const keepValues = omitValueByFieldName(
            state.keepValues,
            newField.name
          );
          const storeDefaultValues = omitValueByFieldName(
            state.defaultValues,
            newField.name
          );
          const initialValues = omitValueByFieldName(
            state.initialValues,
            newField.name
          );

          const formattedValue = formatValue(value);

          const { requiredErrors, validationsErrors } =
            getFieldValidationsErrors<unknown, unknown>(
              value,
              formattedValue,
              requiredRef?.current,
              validationsRef?.current
            );

          state.fields.set(
            fieldId,
            generateField(fieldId, {
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
            defaultValues: storeDefaultValues,
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
        <Value, FormattedValue>({
          fieldId,
          onValueChange,
          formatValue,
        }: GetFieldSetValueOptions<Value, FormattedValue>) =>
        (newValue) => {
          set((state) => {
            const field = getField<Value, FormattedValue>(
              state.fields,
              fieldId
            );

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
        const isLastStep = steps[steps.length - 1]?.name === currentStepName;

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
          return {
            steps: state.steps.filter((step) => step.name !== stepName),
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
        const isLastStep = steps[steps.length - 1]?.name === currentStepName;

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
        const isFirstStep = steps[0]?.name === currentStepName;

        if (isFirstStep) {
          return;
        }

        const currentStepIndex = steps.findIndex(
          (step) => step.name === currentStepName
        );

        get().actions.goToStep(steps[currentStepIndex - 1].name);
      },

      registerCollection: (collectionId, newCollection) => {
        set((state) => {
          const oldCollectionById = state.collections.get(collectionId);

          const initialValues = lodashGet(
            state.initialValues,
            newCollection.name
          );
          const externalValues = lodashGet(
            state.externalValues,
            newCollection.name
          );

          const collectionDefaultValues = newCollection.defaultValues;

          const getKeys = () => {
            if (oldCollectionById?.keys !== undefined) {
              return oldCollectionById.keys;
            }
            if (Array.isArray(externalValues) && externalValues !== undefined) {
              return externalValues?.map((_, index) => index.toString());
            }
            if (Array.isArray(initialValues) && initialValues !== undefined) {
              return initialValues?.map((_, index) => index.toString());
            }
            if (collectionDefaultValues !== undefined) {
              state.actions.setDefaultValues({
                [newCollection.name]: collectionDefaultValues ?? [],
              } as NullablePartial<Values>);
              return collectionDefaultValues?.map((_, index) =>
                index.toString()
              );
            }
            return [];
          };

          state.collections.set(collectionId, {
            name: newCollection.name,
            keys: getKeys(),
            isPristine: oldCollectionById?.isPristine ?? true,
          });

          let newExternalValues = state.externalValues;
          if (Array.isArray(externalValues) && isArrayEmpty(externalValues)) {
            newExternalValues =
              omitValueByFieldName(newExternalValues, newCollection.name) ?? {};
          }
          let newInitialValues = state.initialValues;
          if (Array.isArray(initialValues) && isArrayEmpty(initialValues)) {
            newInitialValues =
              omitValueByFieldName(newInitialValues, newCollection.name) ?? {};
          }

          return {
            collections: state.collections,
            externalValues: newExternalValues,
            initialValues: newInitialValues,
          };
        });
      },

      unregisterCollection: (collectionId) => {
        set((state) => {
          const collection = state.collections.get(collectionId);
          let externalValues = cloneDeep(state.externalValues);
          if (collection) {
            externalValues =
              omitValueByFieldName(externalValues, collection?.name) ?? {};
          }
          state.collections.delete(collectionId);

          return { collections: state.collections, externalValues };
        });
      },

      setCollectionKeys:
        ({ collectionId, collectionName }) =>
        (keys, options) => {
          set((state) => {
            if (collectionName && typeof keys === "object") {
              return {
                externalValues: lodashMerge(cloneDeep(state.externalValues), {
                  [collectionName]: keys.map(() => undefined),
                }),
              };
            }

            if (!collectionId) {
              throw new Error(`collectionId not provided • setCollectionKeys`);
            }

            const currentCollection = state.collections.get(collectionId);

            if (!currentCollection) {
              throw new Error(
                `Collection ${collectionId} not found • setCollectionKeys`
              );
            }

            state.collections.set(collectionId, {
              ...currentCollection,
              isPristine: options?.keepPristine
                ? currentCollection.isPristine
                : false,
              keys:
                typeof keys === "function"
                  ? keys(currentCollection.keys)
                  : keys,
            });

            return {
              collections: state.collections,
            };
          });
        },

      setCollectionValues:
        ({ collectionId, collectionName }) =>
        (values, options) => {
          set((state) => {
            get().actions.setValues(
              {
                [collectionId
                  ? (state.collections.get(collectionId)?.name as string)
                  : (collectionName as string)]: values,
              } as Partial<Values>,
              options
            );

            if (!!collectionId) {
              get().actions.setCollectionKeys({
                collectionId,
                collectionName,
              })(
                (oldKeys) =>
                  values.map((_, index) => oldKeys?.[index] ?? uid.rnd()),
                options
              );
            }

            return {
              collections: state.collections,
            };
          });
        },

      insertMultipleCollectionValues:
        ({ collectionId, collectionName }) =>
        (index, values, options) => {
          set((state) => {
            if (collectionName && Array.isArray(values)) {
              const currentExternalValues = lodashGet(
                state.externalValues,
                collectionName
              );
              const { newValues } = insertItemsAtIndex({
                source: values,
                target: currentExternalValues,
                index,
                hasToOverrideOldValues: true,
              });
              return {
                externalValues: lodashMerge(cloneDeep(state.externalValues), {
                  [collectionName]: newValues,
                }),
              };
            }

            if (!collectionId) {
              throw new Error(`collectionId not provided • setCollectionKeys`);
            }

            const currentCollection = state.collections.get(collectionId);
            if (!currentCollection) {
              throw new Error(
                `Collection ${collectionId} not found • insertMultipleCollectionValues`
              );
            }

            state.actions.setCollectionKeys({
              collectionId,
              collectionName,
            })((oldKeys) => {
              const { newKeys, newValues } = insertItemsAtIndex({
                source: values,
                target: oldKeys,
                index,
              });

              setTimeout(() => {
                get().actions.setValues(
                  { [currentCollection.name]: newValues } as Partial<Values>,
                  { keepPristine: true }
                );
              });

              return newKeys;
            }, options);

            return { collections: state.collections };
          });
        },

      insertCollectionValue:
        ({ collectionId, collectionName }) =>
        (index, value, options) => {
          set((state) => {
            state.actions.insertMultipleCollectionValues({
              collectionId,
              collectionName,
            } as CollectionActionProps)(index, [value], options);
            return { collections: state.collections };
          });
        },

      prependCollectionValue:
        ({ collectionId, collectionName }) =>
        (value, options) => {
          set((state) => {
            state.actions.insertMultipleCollectionValues({
              collectionId,
              collectionName,
            } as CollectionActionProps)(0, [value ?? undefined], options);
            return { collections: state.collections };
          });
        },

      appendCollectionValue:
        ({ collectionId, collectionName }) =>
        (value, options) => {
          set((state) => {
            if (collectionName) {
              const currentExternalValues = lodashGet(
                state.externalValues,
                collectionName
              );
              const { newValues } = insertItemsAtIndex({
                source: [value ?? undefined],
                target: currentExternalValues,
                index: -1,
              });
              return {
                externalValues: lodashMerge(cloneDeep(state.externalValues), {
                  [collectionName]: newValues,
                }),
              };
            }

            if (!collectionId) {
              throw new Error(`collectionId not provided • setCollectionKeys`);
            }
            state.actions.insertMultipleCollectionValues({
              collectionId,
              collectionName,
            })(-1, [value ?? undefined], options);

            return { collections: state.collections };
          });
        },

      removeMultipleCollectionValues:
        ({ collectionId, collectionName }) =>
        (indexes, options) => {
          set((state) => {
            if (collectionName) {
              const currentExternalValues = lodashGet(
                state.externalValues,
                collectionName
              );
              const newValues = removeItemsAtIndexes({
                source: currentExternalValues,
                indexes,
              });
              return {
                externalValues: lodashMerge(cloneDeep(state.externalValues), {
                  [collectionName]: newValues,
                }),
              };
            }

            if (!collectionId) {
              throw new Error(`collectionId not provided • setCollectionKeys`);
            }

            state.actions.setCollectionKeys({
              collectionId,
              collectionName,
            })((oldKeys) => {
              return removeItemsAtIndexes({ indexes, source: oldKeys });
            }, options);

            return { collections: state.collections };
          });
        },

      removeCollectionValue:
        ({ collectionId, collectionName }) =>
        (index, options) => {
          set((state) => {
            state.actions.removeMultipleCollectionValues({
              collectionId,
              collectionName,
            } as CollectionActionProps)([index], options);

            return { collections: state.collections };
          });
        },
    },
  }));
