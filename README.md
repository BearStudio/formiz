# Formiz

<p align="center">
  <a href="https://formiz-react.com">Get started</a> |
  <a href="https://examples.formiz-react.com">Examples</a>
</p>

## Features

- 🏗 Composable API and validations
- 🧙‍ Built-in multi steps
- 💅 Headless, build your own UX!
- 📋 Turn everything into fields
- ⚛️ Built with Typescript & hooks
- 📱 React Native compatible

## Concept

The idea behind **Formiz** is to allow you to build advanced forms with
**multiple steps, complex validations** and a **good UX** without pain.

The main idea is to build fields as independent reusable components.
**Fields can be anything**, not just inputs. Once you have built your fields,
you can use them everywhere.

When you use a field built with Formiz, you can apply validations on it.
**Only the mounted fields will apply their validation** to the current step and to the form.

```jsx
// Field Example
<MyField
  name="email"
  type="email"
  required="Email is required"
  validations={[
    {
      handler: isEmail(),
      message: "Not a valid email",
    },
  ]}
/>
```

## Installation

Requirements

- [NodeJS](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

```sh
pnpm install
```

## Development

```sh
pnpm dev
```

- Documentation available on [localhost:3000](http://localhost:3000/)
- Examples available on [localhost:3001](http://localhost:3001/)

# Sponsors

Thanks to our sponsors. [Become one of them](https://opencollective.com/formiz).

<a
    target = _blank
    href = 'https://bearstudio.fr'
/>
<img
      width = 94
      src = 'https://images.opencollective.com/bearstudio/6e72b13/logo/256.png'
  />
</a>
