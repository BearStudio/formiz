import { Store } from "@/types";
import React from "react";
import { UseBoundStore, StoreApi } from "zustand";

export interface CreateContextOptions<Value = unknown, FormattedValue = Value> {
  /**
   * If `true`, React will throw if context is `null` or `undefined`
   * In some cases, you might want to support nested context, so you can set it to `false`
   */
  strict?: boolean;
  /**
   * Error message to throw if the context is `undefined`
   */
  errorMessage?: string;
  /**
   * The display name of the context
   */
  name?: string;

  value?: Value;
  formattedValue?: FormattedValue;
}

export interface FormContextProps<Value = unknown, FormattedValue = Value> {
  useStore: UseBoundStore<StoreApi<Store>>;
}

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<Value = unknown, FormattedValue = Value>(
  options: CreateContextOptions = {}
) {
  const {
    strict = true,
    errorMessage = "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",
    name,
  } = options;

  const Context = React.createContext<
    FormContextProps<Value, FormattedValue> | undefined
  >(undefined);

  Context.displayName = name;

  function useContext<Value = unknown, FormattedValue = Value>() {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = "ContextError";
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }

    return context as FormContextProps<Value, FormattedValue>;
  }

  return [Context.Provider, useContext, Context] as const;
}
