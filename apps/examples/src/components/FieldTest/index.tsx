import React from "react";

import { deepMemo, FieldProps, useField } from "@formiz/core";

type FieldTestProps = FieldProps<string> & {
  demo?: string;
};

const FieldTestBase = (props: FieldTestProps) => {
  const {
    setValue,
    value,
    otherProps: { demo },
  } = useField(props);

  return (
    <input value={value ?? ""} onChange={(e) => setValue(e.target.value)} />
  );
};

export const FieldTest = deepMemo(FieldTestBase);

const Demo = () => {
  return (
    <FieldTest
      name="demo"
      onValueChange={(value, formattedValue) => {}}
      formatValue={(value) => value?.trim()}
    />
  );
};
