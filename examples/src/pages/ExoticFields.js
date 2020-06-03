import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Button, Flex } from '@chakra-ui/core';
import { FieldPickIdenticalImages } from '../components/Fields/FieldPickIdenticalImages';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';
import { FieldSlider } from '../components/Fields/FieldSlider';
import { useToastValues } from '../hooks/useToastValues';

export const ExoticFields = () => {
  const form = useForm({ subscribe: 'form' });
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
      autoForm
    >
      <PageLayout>
        <PageHeader githubPath="ExoticFields.js">
          Exotic Fields
        </PageHeader>

        <FieldPickIdenticalImages
          mb="12"
          name="twoPictures"
          label="Same images field"
          helper="Select two identical images"
          validMessage="Perfect, the two images are identical!"
          required="You need to select 2 images"
          validations={[
            {
              rule: (val) => (val || {}).selectedCount === 2,
              message: 'You need to select a second image',
            },
            {
              rule: (val) => (val || {}).isIdentical,
              message: 'Image are not identical',
            },
          ]}
          options={[
            'https://source.unsplash.com/WLUHO9A_xik/200x200',
            'https://source.unsplash.com/mEZ3PoFGs_k/200x200',
            'https://source.unsplash.com/2Mr4lBxHpcg/200x200',
            'https://source.unsplash.com/AjvgNTbyuG8/200x200',
            'https://source.unsplash.com/GBgp6Iy16lc/200x200',
            'https://source.unsplash.com/4nulm-JUYFo/200x200',
            'https://source.unsplash.com/MQ4eKnHtOUg/200x200',
            'https://source.unsplash.com/pzMP-RGJ7mY/200x200',
            'https://source.unsplash.com/httxBNGKapo/200x200',
          ]}
        />

        <FieldSlider
          name="slider"
          label="Slider field"
          required="Need some number here"
          helper={(<>Try <strong>7</strong> or <strong>66</strong> to see some errors </>)}
          validations={[
            {
              rule: (val) => val !== 0,
              message: 'Need some real number here',
            },
            {
              rule: (val) => val !== 7,
              message: '7 is a lucky number but please try another one',
            },
            {
              rule: (val) => val !== 66,
              message: '66 is not a valid number',
            },
          ]}
        />

        <Flex>
          <Button
            type="submit"
            ml="auto"
            variantColor="brand"
            isDisabled={!form.isValid && form.isSubmitted}
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};
