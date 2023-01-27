import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Box } from "@chakra-ui/react";
import { Formiz, useForm } from "@formiz/core";
import { NextPage } from "next";

const handleSubmit = (values: any) => {
  console.log('onSubmit form values', values)
}

const NestedForms: NextPage = () => {
  const form = useForm();
  // const collection;

  return (
    <Formiz connect={form} onValidSubmit={handleSubmit} autoForm="step">
      <PageLayout>
        <PageHeader githubPath="steppers.tsx">Nested Forms</PageHeader>
      </PageLayout>
    </Formiz>
  )
}

export default NestedForms