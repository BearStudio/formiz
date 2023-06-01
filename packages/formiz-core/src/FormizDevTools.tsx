import { useFormizContext } from "@/FormizProvider";
import {
  fieldExternalInterfaceSelector,
  formInterfaceSelector,
} from "@/selectors";
import { ExposedExternalFieldState, Store } from "@/types";
import { getFormValues } from "@/utils/form";
import Logo from "@/utils/Logo";
import { deepEqual } from "fast-equals";
import { CSSProperties, useRef, useState } from "react";
import { StoreApi, UseBoundStore } from "zustand";

export const FormizDevTools = () => {
  const formizContext = useFormizContext();

  const [isOpenDebugger, setIsOpenDebugger] = useState(true);

  const storesRef = useRef(formizContext.stores);
  storesRef.current = formizContext.stores;

  const storesIds = formizContext.stores.map(
    (store) => store.getState().form.id
  );

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

  if (!(currentStore || storesRef.current?.[0])) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        right: "1rem",
        height: "25vh",
        borderRadius: "1rem",
        background: "#111729",
        boxShadow: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <FormizDevToolsContent
        store={currentStore ?? storesRef.current?.[0]}
        closeDevTools={() => setIsOpenDebugger(false)}
      >
        <p style={{ fontWeight: "bold" }}>
          Form{" "}
          {storesRef.current?.length > 1 ? (
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
          ) : (
            <span>{storesIds?.[0]}</span>
          )}
        </p>
      </FormizDevToolsContent>
    </div>
  );
};

export const FormizDevToolsContent = ({
  store: useStore,
  closeDevTools,
  children,
}: {
  store: UseBoundStore<StoreApi<Store>>;
  closeDevTools(): void;
  children: React.ReactNode;
}) => {
  const { statefields, formValues, formState } = (useStore ?? {})((state) => {
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

  const [currentField, setCurrentField] = useState<
    [string, ExposedExternalFieldState] | undefined
  >();

  const [search, setSearch] = useState("");

  return (
    <div
      style={{
        height: "full",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          background: "#20293A",
          paddingInline: "1rem",
          paddingBlock: "0.5rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={closeDevTools}>X</button>
          {children}
        </div>

        <div style={{ paddingBlock: "5px", display: "flex", gap: "5px" }}>
          <button
            onClick={() => formState.reset()}
            style={{
              backgroundColor: "#3761E2",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            Reset
          </button>
          <button
            onClick={() => formState.submit()}
            style={{
              backgroundColor: "#3761E2",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", paddingInline: "1rem" }}>
        <div style={{ display: "flex", flex: 1, gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 2,
              gap: "1rem",
            }}
          >
            <input
              placeholder="Filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 2,
                gap: "0.5rem",
                maxHeight: "15vh",
                overflowY: "scroll",
              }}
            >
              {allFieldsEntries
                .filter((field) => field[0].includes(search))
                .map((field) => (
                  <button
                    onClick={() => setCurrentField(field)}
                    style={{
                      display: "flex",
                      flex: 1,
                      paddingBlock: "0.2rem",
                      paddingInline: "0.5rem",
                      background:
                        currentField?.[0] === field[0] ? "#3761E2" : "#20293A",
                      alignItems: "center",
                      minHeight: "2rem",
                      maxHeight: "2rem",
                    }}
                  >
                    <p>{field[0]}</p>
                  </button>
                ))}
            </div>
          </div>
          {currentField ? (
            <div
              style={{
                display: "flex",
                flex: 2,
                background: "#00000030",
                borderRadius: "7px",
                padding: "5px",
                maxHeight: "18vh",
                overflowY: "scroll",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={() => setCurrentField(undefined)}
                    style={{ width: "1rem" }}
                  >
                    X
                  </button>
                  <p>{currentField[0]}</p>
                </div>
                {JSON.stringify(currentField[1], null, 2)}
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  background: "#00000030",
                  borderRadius: "7px",
                  padding: "5px",
                  maxHeight: "18vh",
                  overflowY: "scroll",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Values</p>
                <p>{JSON.stringify(formValues, null, 2)}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  background: "#00000030",
                  borderRadius: "7px",
                  padding: "5px",
                  maxHeight: "18vh",
                  overflowY: "scroll",
                }}
              >
                <p style={{ fontWeight: "bold" }}>State</p>
                <p>{JSON.stringify(formState, null, 2)}</p>
                {/* <p>
                  <strong>resetKey</strong>: {formState.resetKey}
                </p>
                <p>
                  <strong>isReady</strong>: {displayBoolean(formState.isReady)}
                </p>
                <p>
                  <strong>isSubmitted</strong>:{" "}
                  {displayBoolean(formState.isSubmitted)}
                </p>
                <p>
                  <strong>isValid</strong>: {displayBoolean(formState.isValid)}
                </p>
                <p>
                  <strong>isValidating</strong>:{" "}
                  {displayBoolean(formState.isValidating)}
                </p>
                <p>
                  <strong>isPristine</strong>:{" "}
                  {displayBoolean(formState.isPristine)}
                </p> */}
              </div>
            </>
          )}
        </div>
        {/* {formState.steps?.length ? (
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
                  <strong>isPristine</strong>: {displayBoolean(step.isPristine)}{" "}
                  • <strong>isSubmitted</strong>:{" "}
                  {displayBoolean(step.isSubmitted)} •{" "}
                  <strong>isValidating</strong>:{" "}
                  {displayBoolean(step.isValidating)} •{" "}
                  <strong>isVisited</strong>: {displayBoolean(step.isVisited)}{" "}
                </p>
                <FieldEntries
                  fieldsEntries={allFieldsEntries.filter(
                    ([_, field]) => field.stepName === step.name
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          <FieldEntries fieldsEntries={allFieldsEntries} flex={2} />
        )} */}
      </div>
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

const FieldEntries = ({
  fieldsEntries,
  ...style
}: CSSProperties & {
  fieldsEntries: Array<[string, ExposedExternalFieldState<unknown>]>;
}) => (
  <div style={style}>
    <p style={{ marginTop: "10px", fontWeight: "bold" }}>Fields</p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
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
