# Upgrading to v2

## Update your dependencies

All the Formiz packages that you use should be at least on version _2.0.0_.

Additionally, you need to use at least version _18_ for **React**

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

**useForm** has been split into 3 different hooks: **useForm**, **useFormContext** and **useFormFields**.

**useForm** is still used for creating a new form like before. However, the `subscribe` prop is gone, and the hook now only returns the form's state and functions.

```tsx
const MyForm = () => {
  const form = useForm();

  console.log({form.values}) // doesn't work anymore

  return <Formiz connect={form}>{/* Your fields here */}</Formiz>;
};
```

However, if you need to access the form's state and functions at children levels, you'll have to use the **useFormContext** hook, which has the same API as **useForm**. This hook _cannot be used to create a new form_, nor can it be used at the top level.

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

To get access to the form's fields data, you now need to use the **useFormFields** hook.

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

You can also use it at the top level by providing the _connect_ option.

```tsx
const MyForm = () => {
  const form = useForm();
  const formFieldsData = useFormFields({ connect: form });

  return <Formiz connect={form}>{/* Your fields here */}</Formiz>;
};
```

Just like in v1, you can subscribe to different fields to choose when your component should rerender. To do this, you'll have to use the new `fields` prop, which is an array of the fields' names that you want to subscribe to.

Additionnally, you can now use the `selector` prop to choose which data in the fields you really need to subscribe to, avoiding useless rerenders.

In the example below, `myFirstFieldData` returns the _value_ and _isPristine_ data of `myFirstField`, and will cause MyForm to rerender only whenever one of those two values change.

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
   - The function has been renamed to **_setValues_**.
   - The _keepPristine_ option now defaults to **true**.
   - The _keepUnmounted_ option doesn't exist anymore. The function will now always behave as if _keepUnmounted_ was **true**.
2. _invalidateFields_ was renamed to **setErrors**.
3. _getFieldStepName_ was renamed to **getStepByFieldName**.

### 2. useField

#### Typing changes

The hook is now fully typed using Typescript. When creating a field, your props need to extend the `FieldProps` type which now takes the value's type as a parameter. This gives access to the full typing of the object returned by `useField`. The `otherProps` object will also automatically be typed as an object containing everything that is not a Formiz prop in the given type.

#### Validations changes

The validations API changed:

- the _rule_ argument has been renamed to **handler**.
- the validations rules now consider falsy values to always be valid, with the exception of **0**. This implies:
  - that you don't need to check on every validation that you have a value if your field is not required.
  - that an empty string or the boolean value `false` are considered as valid values by default. This behavior can be ignored by setting the `checkFalsy` prop to true in your validation.

### 3. Naming changes

Several props and functions were renamed:

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
