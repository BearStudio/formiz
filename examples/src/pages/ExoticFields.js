import React from 'react';
import { Formiz, useForm } from '@formiz/core';
import { Button, Flex } from '@chakra-ui/core';
import { FieldPickIdenticalImages } from '../components/Fields/FieldPickIdenticalImages';
import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';

export const ExoticFields = () => {
  const form = useForm();

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
      autoForm
    >
      <PageLayout>
        <PageHeader>
          Auto form
        </PageHeader>

        <FieldPickIdenticalImages
          name="twoPictures"
          label="Same images field"
          helper="Select two identical images"
          required="You need to select 2 images"
          validations={[
            {
              rule: val => (val || {}).selectedCount === 2,
              message: 'You need to select a second image',
            },
            {
              rule: val => (val || {}).isIdentical,
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
