# Upgrading to v2

## Update your dependencies

- All formiz packages you use to `@formiz/<package-name>@2.0.0`
- Node 14+
- npm 7.0.0 +

## Breaking changes

### useForm

#### Usage changes

useForm has been split into 3 different hooks: useForm, useFormContext and useFormFields.

**useForm** is still used for creating a new form like before. However, the `subscribe` prop is gone, and the hook now only returns form state and functions.

```tsx
const MyForm = () => {
  const form = useForm();

  console.log({form.values}) // doesn't work anymore

  return <Formiz connect={form}>{/* Your fields here */}</Formiz>;
};
```

However, if you need to access the form's state and functions at children levels, you'll have to use the **useFormContext** hook, which has the same API as **useForm**.

```tsx
const MyForm = () => {
  const form = useForm();

  return (
    <Formiz connect={form}>
      <MyChildren />
    </Formiz>
  );
};

const MyChildren = () => {
  const formContext = useFormContext();
  return {
    /* your code here */
  };
};
```

To get access to the form's values, you now need to use the **useFormFields** hook.

```tsx
const MyChildren = () => {
  // returns all data about all fields
  const form = useFormFields();

  // return my code...
};

const MyForm = () => {
  const form = useForm();

  return (
    <Formiz connect={form}>
      <MyChildren />
    </Formiz>
  );
};
```

You can also use it at top level by providing the [connect](/core/useFormFields#usage-at-top-level) option.

```tsx
const MyForm = () => {
  const form = useForm();
  const formFieldsData = useFormFields({ connect: form });

  return <Formiz connect={form}>{/* Your fields here */}</Formiz>;
};
```

Just like in v1, you can subscribe to different fields to determine when your component should rerender. To do this, you'll have to use the new `fields` prop, which is an array of the fields' names.

Additionnally, you can now use the `selector` prop to choose which data in the fields you really need to subscribe to, avoiding useless rerenders.

In the example below, `myFirstFieldData` returns the _value_ and _pristine_ state of `myFirstField`, and will cause MyForm to rerender whenever one of those two values change.

```tsx
const MyForm = () => {
  const form = useForm();
  const myFirstFieldData = useFormFields({
    connect: form,
    fields: ["myFirstField"],
    selector: (field) => ({ value: field.value, isPristine: field.isPristine }),
  });

  return (
    <Formiz connect={form}>
      <MyField name="myFirstField" />
      <MyField name="mySecondField" />
    </Formiz>
  );
};
```

#### Functions changes

### Functions names updated

- setFieldsValues became setValues
- invalidateFields became setErrors
- getFieldStepName became getStepByFieldName

### Default behavior updated

- setValues (setFieldValues) : keepUnmounted by default (option disappear, was defaulted as false)
- keepPristine default to false (v1: default to true)

### Naming changes

## What changed ?

- `<Formiz />`
  - autoForm can be "form" or "step"
  - onChange -> onValuesChange

* useField()

  - new methods
    - setIsTouched()
  - new hook values
    - isTouched
  - FieldProps changes
  - Field config options
    - formatValue
    - required
    - validations
    - validationsAsync
    - debounceValidationsAsync
    - unstable_notifyOnChangePropsExclusions

* typed useField

### Yet to come in v2

- keepValue option on field
