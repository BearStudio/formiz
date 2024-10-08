import { FieldPickIdenticalImages } from "@/components/FieldPickIdenticalImages";
import { FieldSlider } from "@/components/FieldSlider";
import { useToastValues } from "@/hooks/useToastValues";
import { PageHeader } from "@/layout/PageHeader";
import { PageLayout } from "@/layout/PageLayout";
import { Button, Flex, Stack } from "@chakra-ui/react";
import { Formiz, useForm } from "@formiz/core";
import { isMaxNumber, isMinNumber } from "@formiz/validations";
import { NextPage } from "next";

type FormValues = any;

const ExoticFields: NextPage = () => {
  const toastValues = useToastValues();

  const form = useForm<FormValues>({
    onValidSubmit: (values, form) => {
      toastValues(values);

      form.setErrors({
        name: "You can display an error after an API call",
      });
    },
    onValuesChange: console.log,
  });

  return (
    <Formiz connect={form} autoForm>
      <PageLayout>
        <PageHeader githubPath="exotic-fields.tsx">Exotic Fields</PageHeader>
        <Stack spacing={4}>
          <FieldPickIdenticalImages
            name="twoPictures"
            label="Same images field"
            helper="Select two identical images"
            options={[
              "https://picsum.photos/seed/usefield/200",
              "https://picsum.photos/seed/useform/200",
              "https://picsum.photos/seed/useformfields/200",
              "https://picsum.photos/seed/formiz/200",
              "https://picsum.photos/seed/usecollection/200",
              "https://picsum.photos/seed/ant/200",
              "https://picsum.photos/seed/field/200",
              "https://picsum.photos/seed/useformcontext/200",
              "https://picsum.photos/seed/formiziscool/200",
            ]}
          />

          <FieldSlider
            name="slider"
            label="Slider field"
            required="Need some number here"
            helper={
              <>
                Try <strong>7</strong> or <strong>66</strong> to see some errors
              </>
            }
            validations={[
              {
                handler: (val) => val !== 7,
                message: "7 is a lucky number but please try another one",
              },
              {
                handler: (val) => val !== 66,
                message: "66 is not a valid number",
              },
              {
                handler: isMinNumber(1),
                message: "Min 1",
              },
              {
                handler: isMaxNumber(100),
                message: "Max 100",
              },
            ]}
            defaultValue={0}
          />

          <Flex>
            <Button
              type="submit"
              ml="auto"
              isDisabled={
                (!form.isValid || form.isValidating) && form.isSubmitted
              }
            >
              Submit
            </Button>
          </Flex>
        </Stack>
      </PageLayout>
    </Formiz>
  );
};

export default ExoticFields;
