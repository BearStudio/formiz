import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { deepEqual } from "fast-equals";

import { getField } from "@/utils/form";
import { useStepContext } from "@/FormizStep";

import type {
  UseFieldConfig,
  FieldProps,
  ExposedField,
  FieldValue,
} from "@/types";
import { useFormStore } from "./Formiz";
import { fieldInterfaceSelector } from "./selectors";
import {
  ERROR_USE_FIELD_MISSING_CONTEXT,
  ERROR_USE_FIELD_MISSING_NAME,
  ERROR_USE_FIELD_MISSING_PROPS,
} from "./errors";
import { getFieldValidationsErrors } from "@/utils/validations";

export const useField = <
  Props extends FieldProps<any> = FieldProps<any>,
  Value = Exclude<Required<Props>["defaultValue"], null>,
  FormattedValue = Value
>(
  props: Props,
  config: UseFieldConfig<Value, FormattedValue> = {}
): ExposedField<Value, FormattedValue, Props> => {
  if (!props) {
    throw new Error(ERROR_USE_FIELD_MISSING_PROPS);
  }

  const _config: UseFieldConfig<Value, FormattedValue> = {
    unstable_notifyOnChangePropsExclusions: undefined,
    required: false,
    validations: [],
    validationsAsync: [],
    formatValue: (v) => v as FormattedValue, // TODO: replace as
    ...config,
  };
  const configRef = useRef(_config);
  configRef.current = _config;

  // Merge config and props
  const _props: Props = {
    ...props,
    formatValue: (v) => {
      const valueFormattedFromConfig = _config.formatValue
        ? _config.formatValue(v)
        : v;
      const valueFormattedFromProps = props.formatValue
        ? props.formatValue(valueFormattedFromConfig)
        : valueFormattedFromConfig;
      return valueFormattedFromProps;
    },
    validations: [...(_config.validations ?? []), ...(props.validations ?? [])],
    validationsAsync: [
      ...(_config.validationsAsync ?? []),
      ...(props.validationsAsync ?? []),
    ],
    required: props.required ?? _config.required,
    debounceValidationsAsync:
      props.debounceValidationsAsync ?? _config.debounceValidationsAsync,
  };

  const {
    name,
    defaultValue,
    validations = [],
    validationsAsync = [],
    debounceValidationsAsync = 200,
    required = false,
    formatValue = (v) => v,
    onValueChange = () => undefined,
    keepValue = false,
    ...otherProps
  } = _props;

  const defaultValueRef = useRef(defaultValue);
  defaultValueRef.current = defaultValue;

  const debounceValidationsAsyncRef = useRef(debounceValidationsAsync);
  debounceValidationsAsyncRef.current = debounceValidationsAsync;

  if (!name) {
    throw new Error(ERROR_USE_FIELD_MISSING_NAME);
  }

  const { useStore } = useFormStore() ?? {};

  if (!useStore) {
    throw new Error(ERROR_USE_FIELD_MISSING_CONTEXT);
  }

  const stepContext = useStepContext();
  const stepName = stepContext?.name;

  const storeActions = useStore(
    useCallback((state) => state.actions, []),
    deepEqual
  );

  const formReady = useStore(
    useCallback((state) => state.ready && state.connected, [])
  );

  const formatValueRef = useRef(formatValue);
  formatValueRef.current = formatValue;

  const fieldId = useId();
  const fieldIdRef = useRef(fieldId);
  fieldIdRef.current = fieldId;

  const requiredRef = useRef(required);
  requiredRef.current = required;
  const validationsRef = useRef(validations);
  validationsRef.current = validations;
  const keepValueRef = useRef(keepValue);
  keepValueRef.current = keepValue;

  // Get field from state
  const { value, ...exposedField } = useStore(
    useCallback(
      (state) => {
        const field = getField<Value, FormattedValue>(state.fields, fieldId);

        let draft = fieldInterfaceSelector<Value, FormattedValue>(state)({
          // Field
          ...(field ?? {
            name,
            value: undefined,
            formattedValue: undefined,
            defaultValue: undefined,
            formatValue: (v) => v,
            id: fieldId,
            isTouched: false,
            requiredErrors: [],
            validationsErrors: [],
            validationsAsyncErrors: [],
            externalErrors: [],
            isPristine: true,
            isValidating: false,
            isExternalProcessing: false,
            isDebouncing: false,
          }),
        });

        if (!configRef.current.unstable_notifyOnChangePropsExclusions)
          return draft;

        configRef.current.unstable_notifyOnChangePropsExclusions.forEach(
          (key) => {
            delete draft[key];
          }
        );

        return draft;
      },
      [fieldId, name]
    ),
    deepEqual
  );

  const valueRef = useRef<FieldValue<Value>>(value ?? null);
  valueRef.current = value ?? null;

  const unregisterTimeoutRef = useRef<NodeJS.Timeout>();

  // Register / Unregister
  useEffect(
    function registerField() {
      if (!formReady) {
        return () => {};
      }

      clearTimeout(unregisterTimeoutRef.current);

      const _fieldId = fieldIdRef.current;

      storeActions.registerField(
        _fieldId,
        {
          name,
          stepName,
          value: valueRef.current,
        },
        {
          defaultValue: defaultValueRef.current,
          formatValue: formatValueRef.current,
          requiredRef,
          validationsRef,
        }
      );

      return () => {
        unregisterTimeoutRef.current = setTimeout(() => {
          storeActions.unregisterField(_fieldId, {
            persist: false,
            keepValueRef,
          });
        });
      };
    },
    [name, stepName, storeActions, formReady]
  );

  const validationsAsyncRef = useRef(validationsAsync);
  validationsAsyncRef.current = validationsAsync;

  const valueSerialized = JSON.stringify(value);
  const validationsAsyncDeps = JSON.stringify(
    validationsAsync.map((validation) => ({
      deps: validation.deps,
      message: validation.message,
    }))
  );

  const [internalValue, setInternalValue] = useState<FieldValue<Value>>(value);
  const deferredValue = useDeferredValue(internalValue);

  useEffect(() => {
    // Update internal form on external field value update
    setInternalValue(valueRef.current);

    // Async Validations
    if (!validationsAsyncRef.current.length) {
      return;
    }

    const asyncValidateField = async () => {
      storeActions.updateField(fieldIdRef.current, {
        validationsAsyncErrors: [],
        isDebouncing: false,
        isValidating: true,
      });

      const validationsAsyncHandlers = validationsAsyncRef.current.map(
        async (validation) => {
          return {
            isValid:
              (!validation.checkFalsy &&
                !currentField?.formattedValue &&
                currentField?.formattedValue !== 0) ||
              (await validation.handler(
                currentField?.formattedValue,
                currentField?.value
              )),
            validation,
          };
        }
      );

      const validationsAsyncResults = await Promise.all(
        validationsAsyncHandlers
      );

      const validationsAsyncErrors = validationsAsyncResults
        .filter(({ isValid }) => !isValid)
        .map(({ validation }) => validation.message);

      storeActions.updateField(fieldIdRef.current, {
        validationsAsyncErrors,
        isValidating: false,
      });
    };

    const currentField = useStore.getState().fields.get(fieldIdRef.current);

    const shouldRunAsyncValidations =
      !currentField?.requiredErrors.length &&
      !currentField?.validationsErrors.length;

    if (!shouldRunAsyncValidations) {
      return;
    }

    storeActions.updateField(fieldIdRef.current, {
      isDebouncing: !!debounceValidationsAsyncRef.current,
    });

    let timeoutId: NodeJS.Timeout;
    if (debounceValidationsAsyncRef.current) {
      timeoutId = setTimeout(() => {
        asyncValidateField();
      }, debounceValidationsAsyncRef.current);
    } else {
      asyncValidateField();
    }

    return () => {
      clearTimeout(timeoutId);
      storeActions.updateField(fieldIdRef.current, {
        validationsAsyncErrors: [],
        isDebouncing: false,
      });
    };
  }, [storeActions, useStore, valueSerialized, validationsAsyncDeps]);

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  useEffect(() => {
    if (deferredValue !== undefined && deferredValue !== valueRef.current) {
      storeActions.getFieldSetValue<Value, FormattedValue>({
        fieldId: fieldIdRef.current,
        onValueChange: onValueChangeRef.current,
        formatValue: formatValueRef.current,
      })(deferredValue);
    }
  }, [deferredValue, storeActions]);

  const validationsDeps = JSON.stringify([
    validations.map((validation) => ({
      deps: validation.deps,
      message: validation.message,
    })),
    required,
  ]);
  const validationsDepsPrevRef = useRef(validationsDeps);

  useEffect(() => {
    if (validationsDepsPrevRef.current !== validationsDeps) {
      const currentField = useStore.getState().fields.get(fieldIdRef.current);
      const { requiredErrors, validationsErrors } = getFieldValidationsErrors(
        currentField?.value,
        currentField?.formattedValue,
        requiredRef?.current,
        currentField?.validationsRef?.current
      );
      validationsDepsPrevRef.current = validationsDeps;
      storeActions.updateField(fieldIdRef.current, {
        requiredRef,
        requiredErrors,
        validationsErrors,
      });
    }
  }, [storeActions, validationsDeps, useStore]);

  const externalProcessing = {
    start: () =>
      storeActions.updateField(fieldId, {
        isExternalProcessing: true,
      }),
    end: () =>
      storeActions.updateField(fieldId, {
        isExternalProcessing: false,
      }),
  };

  return {
    value: internalValue,
    setValue: setInternalValue,
    setIsTouched: storeActions.getFieldSetIsTouched(fieldIdRef.current),
    otherProps,
    isRequired: !!required,
    ...exposedField,
    externalProcessing,
  };
};
