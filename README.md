# [WIP] Formiz

Easy to use form library for React with hooks based on [Formsy](https://github.com/formsy/formsy-react) concepts.

## Why Formiz?

- No config & out of the box working forms in React with full validation & UX.
- Everything can be an form field, create your own custom fields!
- Use hooks & cut the complexity to create custom fields :)
- Out of the box multi steps forms!
- Easy way to theme fields to your colors.

## Getting Started

### Install `@formiz/core` package

```
npm install @formiz/core
```

### Create a form with fields

```jsx
import React from 'react'
import { Form, FieldInput } from '@formiz/core'

export const MyForm = () => {
  const submitForm = (data) => {
    console.log(data); // { firstname: 'value', lastname: 'value' }
  }
  
  return (
    <Form onValidSubmit={submitForm} >
      <FieldInput 
        name="firstname"
        label="First Name"
        isRequired
        errorMessages={
          isRequired: 'First Name is required',
        }
      />
      <FieldInput 
        name="lastname"
        label="Last Name"
        isRequired
        errorMessages={
          isRequired: 'Last Name is required',
        }
      />
      <button type="submit">
        Submit
      </button>
    </Form>
  )
}

```


## Fields

### FieldInput

```
import { FieldInput } from '@formiz/core'
```

// TODO

### FieldTextarea

```
import { FieldTextarea } from '@formiz/core'
```

// TODO

### FieldSelect

```
import { FieldSelect } from '@formiz/core'
```

// TODO

### FieldBoolean

```
import { FieldBoolean } from '@formiz/core'
```

// TODO

### FieldCheckboxes

```
import { FieldCheckboxes } from '@formiz/core'
```

// TODO

### FieldRadios

```
import { FieldRadios } from '@formiz/core'
```

// TODO

// TODO


## Multi Steps Form

// TODO

## Theming

// TODO

## Plugins

### FieldCodemirror

```
import { FieldCodemirror } from '@formiz/plugin-codemirror'
```

// TODO



