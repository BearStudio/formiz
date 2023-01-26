# Upgrading to v2

## Update your dependencies

All the Formiz packages that you use should be at least on version _2.0.0_.

Additionally, you need to use at least:

- version _14_ for **Node**
- version _7_ for **npm**
- version _18_ for **React**

```json
dependencies: {
  "@formiz/core": 2.0.0,
  "@formiz/validations": 2.0.0,
  "react": 18.0.0,
}
```

## Breaking changes

### 1. useForm

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

1. _setFieldsValues_
   - The function has been renamed to **_setValues_**
   - The _keepPristine_ option now defaults to **true**
   - The _keepUnmounted_ option doesn't exist anymore. The function will now always behave as if _keepUnmounted_ was **true**.
2. _invalidateFields_ was renamed to **setErrors**
3. _getFieldStepName_ was renamed to **getStepByFieldName**

### 2. useField

The hook is now fully typed using typescript. `otherProps` will automatically be typed as an object containing everything that is not a Formiz prop in the given type.

### 3. Naming changes

Several field props and functions were renamed:

- on the `<Formiz />` component
  - onChange was renamed to **onValuesChange**
- on the `useField` hook
  - onChange was renamed to **onValueChange**
  - debounce was renamed to **debounceValidationsAsync**
  - async validations was renamed to **validationsAsync**

### 4. Yet to come in v2

#### stateSubscription for useForm & useFormContext

At the moment, both _useForm_ and _useFormContext_ will always return the full state and every function available for your form. The **stateSubscription** option will allow to only return the necessary state data, avoiding some undesired rerenders and enhancing the performances of your app.

#### keepValue

The _keepValue_ option on fields is set to return to Formiz in a near future, allowing you to get back the value of a field that has been unmounted and then remounted.

#### validating.start & validating.end

Those two functions will allow you to indicate to a field that you are starting and ending external validations outside of the formiz standard lifecycle, updating the isValidating state to reflect what you are doing.
