import { DockerImage } from "@/components/RealLife1/DockerImage";
import { MultiStepsLayout } from "@/components/MultiStepsLayout";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { Heading, Icon } from "@chakra-ui/react";
import { Formiz, useForm } from "@formiz/core";
import { NextPage } from "next";
import { FiPlus } from "react-icons/fi";
import { General } from "@/components/RealLife1/General";
import { ExposedPorts } from "@/components/RealLife1/ExposedPorts";

type FormValues = {};

const RealLife1: NextPage = () => {
  const toastValues = useToastValues<FormValues>();

  const form = useForm<FormValues>({
    onValidSubmit: (values) => {
      toastValues(values);
      form.setErrors({
        "docker.image": "You can display an error after an API call",
      });
      const stepWithError = form.getStepByFieldName("docker.image");
      if (stepWithError) {
        form.goToStep(stepWithError.name);
      }
    },
    onValuesChange: console.log,
  });

  return (
    <Formiz connect={form} autoForm="step">
      <MultiStepsLayout submitLabel="Create app">
        <PageHeader githubPath="UseCase1/index.js">Real life #1</PageHeader>

        <Heading fontSize="lg" mb={6} mt={12}>
          <Icon as={FiPlus} mr={2} fontSize="sm" />
          Create a Docker Webapp
        </Heading>

        <DockerImage />
        <ExposedPorts />
        <General />
      </MultiStepsLayout>
    </Formiz>
  );
};

export default RealLife1;
