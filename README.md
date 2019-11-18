# Welcome to 🐜 Formiz
React **forms with easy validation and multi steps**

![Tests Badge](https://github.com/ivan-dalmet/formiz/workflows/Formiz%20Test/badge.svg)

#### 🧙‍ **Multi steps forms**
Multi steps form logic available out of the box! No more pain to build perfect UX for complex forms.

#### ✅ **Easy form validation**
Create forms in React with full validation without the pain. Turn everything into a custom field with full validation!

#### 🐛 **No more logic duplication**
Don't duplicate your logic between display and validation. Validation is enabled only if the field is displayed.

#### 💅 **Forms with your own UX**
Choose how to render validations, form buttons, and navigation between steps (wizard, tabs, other). It's your choice!

#### ⚛️ **Built with hooks**
Use hooks & cut the complexity to create custom fields :) Use complex logic without even thinking of it.

[Getting started](https://formiz-react.com/docs/getting-started)

## Looking for the documentation?

Visit [formiz-react.com](https://formiz-react.com) for [full documentation](https://formiz-react.com/docs/getting-started) and [live demos](https://formiz-react.com/docs/demos/wizard).

## Looking for examples?

Visit documentation for [live demos](https://formiz-react.com/docs/demos/wizard).

Visit [formiz-examples.netlify.com](https://formiz-examples.netlify.com) for examples with [Chakra UI](https://chakra-ui.com/).

## Concept

The idea behind **Formiz** is to allow you to build advanced forms with
**multiple steps, complex validations** and a **good UX** without pain.

The main idea is to build fields as independent reusable components.
**Fields can be anything**, not just inputs. Once you have built your fields,
you can use them everywhere.

When you use a field built with Formiz, you can apply validations rules on it.
**Only the mounted fields will apply their validation** to the current step and to the form.

```jsx
// Example
<MyField
  name="email"
  type="email"
  required="Email is required"
  validations={[
    {
      rule: isEmail(),
      message: 'Not a valid email',
    }
  ]}
/>
```

**Formiz core** does not provide any styles, so you can **use it with any UI library and style you want**.
Use it with [Chakra UI](https://chakra-ui.com/), [ReactStrap](https://reactstrap.github.io/), [Material UI](https://material-ui.com/) or your own styles.


# Contributing

Feel like contributing? That's awesome!

Follow the flowing guide to run the project locally.


### Install dependencies

This project use [Yarn](https://yarnpkg.com) and [Lerna](https://lerna.js.org/).

This is needed the ** the first time** you get the project to install all dependencies.

```
yarn
```

### Bootstrap the repo with Lerna

This is needed the ** the first time** you get the project to link local packages together.

```
yarn bs
```

### Start documentation

```
yarn start
```

### Run test in dev

```
yarn test:dev
```

This can be a little hard to see test results with this command.

So instead you can go in each packages folders and run tests from here.

```
cd packages/core
yarn test:dev
```