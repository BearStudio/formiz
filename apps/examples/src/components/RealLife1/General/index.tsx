import React from "react";
import { FormizStep } from "@formiz/core";
import { FieldInput } from "@/components/FieldInput";
import { FieldTextarea } from "@/components/FieldTextarea";

export const General = () => (
  <FormizStep name="step1">
    <FieldInput name="name" label="App Name" required="Required" />
    <FieldTextarea name="description" label="App Description" />
  </FormizStep>
);
