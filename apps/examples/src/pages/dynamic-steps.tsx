import React from "react";
import { Formiz, useForm, FormizStep, useFormFields } from "@formiz/core";
import { isMinNumber, isMaxNumber } from "@formiz/validations";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { FieldInput } from "@/components/FieldInput";
import { MultiStepsLayout } from "@/components/MultiStepsLayout";

const MAX_STEPS = 10;
const minMax = (min: number, max: number) => (value: string | null) =>
  Math.max(Math.min(parseInt(value || "", 10), max), min);

type FormValues = {};

const DynamicSteps = () => {
  const toastValues = useToastValues();

  const form = useForm<FormValues>({
    onValidSubmit: (values, form) => {
      toastValues(values);

      form.setErrors({
        name: "You can display an error after an API call",
      });
    },
  });
  const values = useFormFields({
    connect: form,
    fields: ["count"] as const,
    selector: (field) => ({ value: field.value, rawValue: field.rawValue }),
  });

  return (
    <Formiz connect={form} autoForm="step">
      <MultiStepsLayout submitLabel="Submit">
        <PageHeader githubPath="dynamic-steps.tsx">Dynamic Steps</PageHeader>
        <FormizStep name="start" order={1000}>
          <FieldInput<number>
            name="count"
            label="Steps Count"
            type="number"
            required="Required"
            defaultValue="2"
            formatValue={minMax(1, MAX_STEPS)}
            validations={[
              {
                handler: (value) => isMinNumber(1)(value),
                message: "Min steps count is 1",
              },
              {
                handler: (value) => isMaxNumber(MAX_STEPS)(value),
                message: "Max steps count is 10",
              },
            ]}
          />
        </FormizStep>
        {[...Array(values.count?.value || 0)].map((_, index) => (
          <FormizStep
            key={index}
            name={`dynamic-${index}`}
            order={1000 + index}
          >
            <FieldInput
              name={`steps[${index}].name`}
              label={`Dynamic Step ${index + 1} Name`}
            />
          </FormizStep>
        ))}
        <FormizStep name="end" order={2000}>
          <FieldInput name="end" label="End" required="Required" />
        </FormizStep>
      </MultiStepsLayout>
    </Formiz>
  );
};

export default DynamicSteps;
