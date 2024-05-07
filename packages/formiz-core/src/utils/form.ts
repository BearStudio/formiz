import type {
  Collections,
  DefaultFormValues,
  Field,
  Fields,
  FormizCollection,
  FormStateElement,
  PartialField,
  ResetElement,
  ResetOptions,
  useFormProps,
} from "@/types";
import { isObject } from "@/utils/global";
import { Collection } from "lodash";

import cloneDeep from "lodash/cloneDeep";
import lodashGet from "lodash/get";
import lodashOmit from "lodash/omit";

export const parseValues = <Values extends object = DefaultFormValues>(
  values: Values
) =>
  Object.keys(values).reduce((acc, key) => parseValuesName(key, acc), values);

const parseValuesName = (name: string, values: any): any => {
  if (name.indexOf(".") < 0 && name.indexOf("[") < 0) {
    return values;
  }

  const value = values[name];
  const { [name]: deletedKey, ...nextValues } = values || {};
  const [current, ...otherNames] = name.split(".");
  const isArraySyntax = current.match(/\[([0-9]*)\]$/g);

  if (isArraySyntax) {
    const [currentName, , currentIndex] = current.split(/(\[|\])/g);
    const currentCollection = values[currentName] || [];

    if (otherNames.length) {
      const group = {
        ...(values[currentName] && isObject(values[currentName][currentIndex])
          ? values[currentName][currentIndex]
          : {}),
        [otherNames.join(".")]: value,
      };

      currentCollection[currentIndex] = parseValues(group);
    } else {
      currentCollection[currentIndex] = value;
    }

    return {
      ...nextValues,
      [currentName]: currentCollection,
    };
  }

  const group = {
    ...(isObject(values[current]) ? values[current] : {}),
    [otherNames.join(".")]: value,
  };

  return {
    ...nextValues,
    [current]: parseValues(group),
  };
};

export const getValueByFieldName = (values: any, fieldName: string) => {
  if (!values) {
    return undefined;
  }
  return lodashGet(parseValues(values), fieldName);
};

export const omitValueByFieldName = <Values = any>(
  values: Values,
  fieldName: string
): Partial<Values> | undefined => {
  if (!values) {
    return undefined;
  }
  return lodashOmit(
    parseValues(cloneDeep(values)),
    fieldName
  ) as Partial<Values>;
};

export const getFormFlatValues = <Values extends object = DefaultFormValues>(
  fields: Fields
): Values =>
  Array.from(fields.values()).reduce(
    (obj, field) => ({
      ...obj,
      [field.name]: field.formattedValue,
    }),
    {} as Values
  );

export const getFormValues = <Values extends object = any>(fields: Fields) => {
  const values = getFormFlatValues<Values>(fields);
  return parseValues(values);
};

export const getFormFields = <Selection>(
  flatFields: Record<string, Selection>
) => {
  return parseValues(flatFields);
};

export const getField = <Value = unknown, FormattedValue = Value>(
  fields: Fields,
  fieldId: string
) => fields.get(fieldId) as Field<Value, FormattedValue>;

export const getFieldIsValid = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>
) =>
  !field.requiredErrors.length &&
  !field.validationsErrors.length &&
  !field.validationsAsyncErrors.length &&
  !field.externalErrors.length;

export const getFieldIsPristine = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>
) => field.isPristine;

export const getFieldIsValidating = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>
) => field.isValidating;

export const getFieldIsExternalProcessing = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>
) => field.isExternalProcessing;

export const getFieldIsDebouncing = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>
) => field.isDebouncing;

export const getFieldIsProcessing = <Value, FormattedValue>(
  field: Field<Value, FormattedValue>,
  formIsReady: boolean = true
) =>
  !formIsReady ||
  getFieldIsDebouncing(field) ||
  getFieldIsValidating(field) ||
  getFieldIsExternalProcessing(field);

export const getCollectionIsPristine = (collection: FormizCollection) =>
  collection.isPristine;

export const getFormIsValid = (fields: Fields) =>
  Array.from(fields).every(([, field]) => getFieldIsValid(field));

export const getFormIsValidating = (fields: Fields) =>
  Array.from(fields).some(([, field]) => getFieldIsValidating(field));

export const getFormIsDebouncing = (fields: Fields) =>
  Array.from(fields).some(([, field]) => getFieldIsDebouncing(field));

export const getFormIsProcessing = (fields: Fields, formIsReady: boolean) =>
  !formIsReady ||
  Array.from(fields).some(([, field]) => getFieldIsProcessing(field));

export const getFormIsPristine = (fields: Fields, collections: Collections) =>
  Array.from(fields).every(([, field]) => getFieldIsPristine(field)) &&
  Array.from(collections).every(([_, collection]) =>
    getCollectionIsPristine(collection)
  );

export const getStepIsValid = (stepName: string, fields: Fields) =>
  Array.from(fields)
    .filter(([, field]) => field.stepName === stepName)
    .every(([, field]) => getFieldIsValid(field));

export const getStepIsValidating = (stepName: string, fields: Fields) =>
  Array.from(fields)
    .filter(([, field]) => field.stepName === stepName)
    .some(([, field]) => getFieldIsValidating(field));

export const getStepIsDebouncing = (stepName: string, fields: Fields) =>
  Array.from(fields)
    .filter(([, field]) => field.stepName === stepName)
    .some(([, field]) => getFieldIsDebouncing(field));

export const getStepIsProcessing = (
  stepName: string,
  fields: Fields,
  formIsReady: boolean
) =>
  !formIsReady ||
  Array.from(fields)
    .filter(([, field]) => field.stepName === stepName)
    .some(([, field]) => getFieldIsProcessing(field));

export const getStepIsPristine = (stepName: string, fields: Fields) =>
  Array.from(fields)
    .filter(([, field]) => field.stepName === stepName)
    .every(([, field]) => getFieldIsPristine(field));

export const generateField = <Value>(
  fieldId: string,
  field: PartialField<Value> & Pick<Field<Value>, "name" | "value">
): Field<Value> => {
  return {
    formattedValue: field.value as Value,
    defaultValue: field.value,
    isPristine: true,
    isTouched: false,
    isValidating: false,
    isExternalProcessing: false,
    isDebouncing: false,
    requiredErrors: [],
    validationsErrors: [],
    validationsAsyncErrors: [],
    externalErrors: [],
    requiredRef: field.requiredRef,
    validationsRef: field.validationsRef,
    formatValue: (v) => v,
    ...field,
    id: fieldId,
  };
};

export const isResetAllowed = (
  resetElement: ResetElement,
  resetOptions?: ResetOptions
) =>
  !resetOptions ||
  ((!resetOptions.only || resetOptions.only.includes(resetElement)) &&
    (!resetOptions.exclude || !resetOptions.exclude.includes(resetElement)));

export const isFormStateSubscribed = (
  state: FormStateElement,
  value: unknown,
  stateSubscription: useFormProps["stateSubscription"]
) =>
  !stateSubscription ||
  ((!stateSubscription.only || stateSubscription.only.includes(state)) &&
    (!stateSubscription.exclude || !stateSubscription.exclude.includes(state)))
    ? { [state]: value }
    : {};
