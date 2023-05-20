import { useFormizContext } from "@/FormizProvider";
import {
  fieldExternalInterfaceSelector,
  formInterfaceSelector,
} from "@/selectors";
import { ExposedExternalFieldState, Store } from "@/types";
import { getFormValues } from "@/utils/form";
import Logo from "@/utils/Logo";
import { deepEqual } from "fast-equals";
import { useRef, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export const FormizDevTools = () => {
  const formizContext = useFormizContext();

  const [isOpenDebugger, setIsOpenDebugger] = useState(false);

  const storesRef = useRef(formizContext.stores);
  storesRef.current = formizContext.stores;

  const storesIds = formizContext.stores.map(
    (store) => store.getState().form.id
  );

  console.log({ storesIds });

  const [currentStoreId, setCurrentStoreId] = useState<string>();

  const currentStore = storesRef.current.find(
    (store) => store.getState().form.id === currentStoreId
  );

  if (!isOpenDebugger) {
    return (
      <button
        style={{ position: "fixed", bottom: "1rem", left: "1rem" }}
        onClick={() => setIsOpenDebugger(true)}
      >
        <Logo aria-hidden />
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100vw",
        height: "25vh",
        background: "#48bb78",
        boxShadow: "10px",
        borderRadius: "10px",
        padding: "5px",
        overflow: "hidden",
      }}
    >
      {storesRef.current?.length > 1 && (
        <select
          value={currentStore?.getState().form.id}
          onChange={(e) => {
            console.log(e.target.value);
            setCurrentStoreId(e.target.value);
          }}
        >
          {storesIds.map((storeId) => (
            <option key={storeId} label={storeId} value={storeId} />
          ))}
        </select>
      )}
      <FormizDevToolsContent store={currentStore ?? storesRef.current?.[0]} />
    </div>
  );
};

export const FormizDevToolsContent = ({
  store: useStore,
}: {
  store: UseBoundStore<StoreApi<Store>>;
}) => {
  const { statefields, formValues, formState } = useStore((state) => {
    const statefields = Array.from(state.fields.values()).reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: fieldExternalInterfaceSelector(state)(field),
      }),
      {}
    );
    const formValues = getFormValues(state.fields);
    return { statefields, formValues, formState: formInterfaceSelector(state) };
  }, deepEqual);

  const allFieldsEntries =
    Object.entries<ExposedExternalFieldState<unknown>>(statefields);

  return (
    <div
      style={{
        overflow: "scroll",
        height: "25vh",
        background: "#00000030",
        borderRadius: "7px",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div>
        <p>
          <strong>Form {formState.id}</strong>
        </p>
        <p>
          <strong>resetKey</strong>: {formState.resetKey} •{" "}
          <strong>isReady</strong>: {displayBoolean(formState.isReady)} •{" "}
          <strong>isSubmitted</strong>: {displayBoolean(formState.isSubmitted)}{" "}
          • <strong>isValid</strong>: {displayBoolean(formState.isValid)} •{" "}
          <strong>isValidating</strong>:{" "}
          {displayBoolean(formState.isValidating)} • <strong>isPristine</strong>
          : {displayBoolean(formState.isPristine)}
        </p>
        <div style={{ paddingBlock: "5px", display: "flex", gap: "5px" }}>
          <button
            onClick={() => formState.submit()}
            style={{
              backgroundColor: "#00000070",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            Submit
          </button>
          <button
            onClick={() => formState.reset()}
            style={{
              backgroundColor: "#00000070",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            Reset
          </button>
        </div>
        <div
          style={{
            background: "#00000030",
            borderRadius: "7px",
            padding: "5px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Values</p>
          <p>{JSON.stringify(formValues, null, 2)}</p>
        </div>
      </div>
      {formState.steps?.length ? (
        <div
          style={{
            background: "#00000030",
            borderRadius: "7px",
            padding: "5px",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Steps</p>
          {formState.steps.map((step) => (
            <div
              key={step.name}
              style={{
                background: "#00000030",
                borderRadius: "7px",
                padding: "5px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>{step.name}</p>
              <p>
                <strong>index</strong>: {step.index} •{" "}
                <strong>isCurrent</strong>: {displayBoolean(step.isCurrent)} •{" "}
                <strong>isValid</strong>: {displayBoolean(step.isValid)} •{" "}
                <strong>isPristine</strong>: {displayBoolean(step.isPristine)} •{" "}
                <strong>isSubmitted</strong>: {displayBoolean(step.isSubmitted)}{" "}
                • <strong>isValidating</strong>:{" "}
                {displayBoolean(step.isValidating)} • <strong>isVisited</strong>
                : {displayBoolean(step.isVisited)}{" "}
              </p>
              {displayFieldsEntries(
                allFieldsEntries.filter(
                  ([_, field]) => field.stepName === step.name
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        displayFieldsEntries(allFieldsEntries)
      )}
    </div>
  );
};

const displayBoolean = (value: boolean) => (value ? "✅" : "❌");

const displayField = (field: ExposedExternalFieldState<unknown>) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    }}
  >
    <p style={{ fontSize: "0.8rem" }}>
      <strong>value</strong>: {JSON.stringify(field.value, null, 2)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>rawValue</strong>: {JSON.stringify(field.rawValue, null, 2)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isReady</strong>: {displayBoolean(field.isReady)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isTouched</strong>: {displayBoolean(field.isTouched)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isPristine</strong>: {displayBoolean(field.isPristine)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>shouldDisplayError</strong>:{" "}
      {displayBoolean(field.shouldDisplayError)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>errorMessages</strong>: {JSON.stringify(field.errorMessages)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isValid</strong>: {displayBoolean(field.isValid)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isValidating</strong>: {displayBoolean(field.isValidating)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isExternalProcessing</strong>:{" "}
      {displayBoolean(field.isExternalProcessing)}
    </p>
    <p style={{ fontSize: "0.8rem" }}>
      <strong>isDebouncing</strong>: {displayBoolean(field.isDebouncing)}
    </p>
  </div>
);

const displayFieldsEntries = (
  fieldsEntries: Array<[string, ExposedExternalFieldState<unknown>]>
) => (
  <div>
    <p style={{ marginTop: "10px", fontWeight: "bold" }}>Fields</p>
    <div
      style={{
        display: "flex",
        gap: "2rem",
        overflowX: "scroll",
      }}
    >
      {fieldsEntries.map(([fieldName, field]) => (
        <div
          key={fieldName}
          style={{
            background: "#00000030",
            borderRadius: "7px",
            padding: "5px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "0.8rem",
            }}
          >
            {fieldName}
          </p>
          {displayField(field)}
        </div>
      ))}
    </div>
  </div>
);
