# [WIP] Formiz

An very easy to use form library for React with hooks based on [Formsy](https://github.com/formsy/formsy-react) concepts.

## Why Formiz?

- No config & out of the box working forms in React with full validation & UX.
- Everything can be an form field, create your own custom fields!
- Use hooks & cut the complexity to create custom fields :)
- Out of the box multi steps forms!

## Getting Started

### Install `react-formiz` package

```
npm install react-formiz
```

### Create a form with fields

```jsx
import React from 'react'
import { Form, FieldInput } from 'react-formiz'

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
