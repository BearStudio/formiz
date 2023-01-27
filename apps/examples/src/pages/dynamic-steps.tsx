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
  const form = useForm();
  const values = useFormFields({
    connect: form,
    fields: ["count"],
    selector: (field) => ({ value: field.value, rawValue: field.rawValue }),
  });
  const toastValues = useToastValues();

  const handleSubmit = (values: FormValues) => {
    toastValues(values);

    form.setErrors({
      name: "You can display an error after an API call",
    });
  };

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit} autoForm="step">
      <MultiStepsLayout submitLabel="Submit">
        <PageHeader githubPath="DynamicSteps.tsx">Dynamic Steps</PageHeader>
        <FormizStep name="start" order={1000}>
          <FieldInput
            name="count"
            label="Steps Count"
            type="number"
            required="Required"
            defaultValue="1"
            formatValue={minMax(1, MAX_STEPS)}
            validations={[
              {
                handler: (_, rawValue) => isMinNumber(1)(rawValue),
                message: "Min steps count is 1",
              },
              {
                handler: (_, rawValue) => isMaxNumber(MAX_STEPS)(rawValue),
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
