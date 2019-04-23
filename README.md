# [WIP] Formiz

---

## ⚠️ DO NOT USE ⚠️

This is a **👩‍🔬 work in progress** repo.

This is **Proof of Concept** of 📚 documentation and doesn't reflect any existing code.

---

Easy to use form library for React with hooks based on [Formsy](https://github.com/formsy/formsy-react) concepts.

## Why Formiz?

- No config & out of the box working forms in React with full validation & UX.
- Everything can be an form field, create your own custom fields!
- Use hooks & cut the complexity to create custom fields :)
- Out of the box multi steps forms!
- Easy way to theme fields to your colors.

## Getting Started

### Install Formiz core & fields

```
npm install @formiz/core @formiz/fields
```

### Create a form with fields

```jsx
import React from 'react'
import { Form } from '@formiz/core'
import { FieldInput } from '@formiz/fields'

export const MyForm = () => {
  const submitForm = (values) => {
    console.log(values); // { firstname: 'value', lastname: 'value' }
  }

  return (
    <Form onValidSubmit={submitForm} >
      <FieldInput
        name="firstname"
        label="First Name"
        isRequired="First Name is required"
      />
      <FieldInput
        name="lastname"
        label="Last Name"
        isRequired="Last Name is required"
      />
      <button type="submit">
        Submit
      </button>
    </Form>
  )
}
```

---

### Form Props

#### onSubmit(values, actions)

// TODO

#### onValidSubmit(values, actions)

// TODO

#### onInvalidSubmit(values, actions)

// TODO

#### onChange(values, actions)

// TODO

#### onValid()

// TODO

#### onInvalid()

// TODO

---

### Form Actions

`onSubmit`, `onValidSubmit`, `onInvalidSubmit` and `onChange` props get a second argument of `actions` which is an object of actions that you can apply to the form.

#### actions.invalidateFields()

// TODO

#### actions.resetForm()

// TODO

---

### Field Props

All Formiz field (built in or custom fields) have the following props.

#### name [required]

The name is required to register the field in the form.

```jsx
<Field name="myFieldName" />
```

```
// Form values
{
  myFieldName: 'value'
}
```

You can also use dot notation. This will result in a nested object in the form values.

```jsx
<Field name="myGroup.myFieldName" />
```

```
// Form values
{
  myGroup: {
    myFieldName: 'value'
  }
}
```

#### label

// TODO

#### helper

// TODO

#### defaultValue

Pass an initial value to the field.

```jsx
<Field name="myFieldName" defaultValue="My initial value" />
```

#### isRequired

Shortcut to enable `isRequired` validation.

```jsx
<Field name="myFieldName" isRequired />
<Field name="myFieldName2" isRequired="Field is Required" />
```

#### validations

An array of object with:
- `rule(fieldValue, formValues)`: Built in validation rule or custom validation function (must return `true` if the rule is valid).
- `invalidMessage`: The message if rule is invalid.

```jsx
<Field
  name="myFieldName"
  validations={[
    {
      rule: isRequired,
      invalidMessage: 'Field is required',
    },
    {
      rule: isNotEmptyString,
      invalidMessage: 'Field can\'t be empty',
    },
    {
      rule: (value, values) => value.toLowerCase() !== 'john',
      invalidMessage: 'Field can\'t be john',
    },
  ]}
/>
```

#### onChange(value, values)

// TODO

---

## Available Fields

### FieldInput

```jsx
import { FieldInput } from '@formiz/fields'
```

// TODO

### FieldTextarea

```jsx
import { FieldTextarea } from '@formiz/fields'
```

// TODO

### FieldSelect

```jsx
import { FieldSelect } from '@formiz/fields'
```

// TODO

### FieldBoolean

```jsx
import { FieldBoolean } from '@formiz/fields'
```

// TODO

### FieldCheckboxes

```jsx
import { FieldCheckboxes } from '@formiz/fields'
```

// TODO

### FieldRadios

```jsx
import { FieldRadios } from '@formiz/fields'
```

// TODO

---

## Field Validation

```
import { isNotEmptyString } from '@formiz/validations'
```

```jsx
<FieldInput
  name="firstname"
  label="First Name"
  validations={[
    {
      rule: isRequired,
      invalidMessage: 'Field is required',
    },
    {
      rule: isNotEmptyString,
      invalidMessage: 'Field can\' be empty',
    },
    {
      rule: (value, values) => value.toLowerCase() !== 'john',
      invalidMessage: 'Field can\'t be john',
    },
  ]}
/>
```

---

## List of validations rules

```
import { ruleName } from '@formiz/validations'
```

#### isNotEmptyString

// TODO

#### isNotEmptyArray

// TODO

#### isEmail

// TODO

#### isNumber

// TODO

#### isLength(length)

// Todo

#### isMinLength(length)

// Todo

#### isMaxLength(length)

// Todo

---

## Handle API errors

```jsx
<Form
  onValidSubmit={(values, { invalidateFields }) => {
    invalidateFields({
      fieldName: 'Error message',
    })
  }}
/>
  // Put your fields here
</Form>
```

---

## Multi Steps Form

```jsx
import React, { Fragment } from 'react'
import { Form, FormStep } from '@formiz/core'
import { FieldInput } from '@formiz/fields'

export const MyForm = () => {
  const submitForm = (values) => {
    console.log(values); // { firstname: 'value', lastname: 'value' }
  }

  return (
    <Form onValidSubmit={submitForm} >
      {({ isFirstStep, isLastStep, prevStep, nextStep }) => (
        <Fragment>
          <FormStep>
            <FieldInput
              name="firstname"
              label="First Name"
              isRequired="First Name is required"
            />
          </FormStep>
          <FormStep>
            <FieldInput
              name="lastname"
              label="Last Name"
              isRequired="Last Name is required"
            />
          </FormStep>
          <div>
            {isFirstStep ? (
              <button type="text" onClick={() => window.history.back()}>
                Cancel
              </button>
            ) : (
              <button type="button" onClick={prevStep}>
                Back
              </button>
            )}

            {isLastStep ? (
              <button type="submit">
                Submit
              </button>
            ) : (
              <button type="button" onClick={nextStep}>
                Continue
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Form>
  )
}
```

---

## Custom Fields

### `useFormiz()` hook

When using the `useFormiz` hook, you need to pass all `props` from your component to the hook.

```jsx
import React from 'react'
import { useFormiz } from '@formiz/core'

const MyField = (props) => {
  const {
    name,
    label,
    helper,
    defaultValue,
    value,
    setValue,
    isValid,
    isPristine,
    isFormSubmitted,
    isStepSubmitted,
    invalidMessage,
    invalidMessages,
  } = useFormiz(props)

  return (
    ...
  )
}
```

Now your component get ~super powers~ all default Formiz field props!

The `useFormiz` return an object with the following properties:

##### name

// TODO

##### label

// TODO

##### helper

// TODO

##### defaultValue

// TODO

##### value

// TODO

##### setValue()

// TODO

##### isValid

// TODO

##### isPristine

// TODO

##### isFormSubmitted

// TODO

##### isStepSubmitted

// TODO

##### invalidMessage

// TODO

##### invalidMessages

// TODO


### Create your custom field

```jsx
// MyField.js
import React from 'react'
import { useFormiz } from '@formiz/core'

const MyField = (props) => {
  const { value, setValue, invalidMessage, isValid } = useFormiz(props)
  const { customProperty } = props;

  return (
    <div>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} >
      <strong>{ customProperty }</strong>
      {!isValid && (
        <p>{ invalidMessage }</p>
      )}
    </div>
  )
}
```

### Use your custom field

```jsx
import React from 'react'
import { Form } from '@formiz/core'
import { MyField } from './MyField'

export const MyForm = () => {
  const submitForm = (values) => {
    console.log(values); // { myCustomField: 'value' }
  }

  return (
    <Form onValidSubmit={submitForm} >
      <MyField
        name="myCustomField"
        customProperty="Custom Field"
        isRequired="Custom Field is required"
      />
      <button type="submit">
        Submit
      </button>
    </Form>
  )
}
```
---

## Theming

// TODO

---

## Plugins

### Codemirror (plugin)

#### Install
```
npm install @formiz/plugin-codemirror
```

#### How to use

```jsx
import React from 'react'
import { Form } from '@formiz/core'
import { FieldCodemirror } from '@formiz/plugin-codemirror'

export const MyForm = () => {
  const submitForm = (values) => {
    console.log(values); // { code: 'value' }
  }

  return (
    <Form onValidSubmit={submitForm} >
      <FieldCodemirror
        name="code"
        label="Code"
        isRequired="Code is required"
      />
      <button type="submit">
        Submit
      </button>
    </Form>
  )
}
```

#### FieldCodemirror Props

// TODO

---
