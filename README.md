# Formiz

![Tests Badge](https://github.com/ivan-dalmet/formiz/workflows/Formiz%20Test/badge.svg)

React multi steps forms with full validations

👩‍🔬 This is an early and alpha release of Formiz. API is subject to change. Do not use in production.

## 📚 Full documentation

Full documentation & demos: [formiz-react.com](https://formiz-react.com)

## 📋 TODO

- [x] Write Proof of Concept 📚 documentation
- [x] Develop a Proof of Concept for `<Formiz>` component and a custom field with `useFormiz()` hook.
- [x] Develop a Proof of Concept for `<FormizStep>` for multi steps forms.
- [x] Publish `@formiz/core` package with `<Formiz>`, `<FormizStep>`, `useField()` and `useForm()`.
- [x] Publish `@formiz/validations` package.
- [ ] Publish `@formiz/fields` package.

## Development

This project use [Yarn](https://yarnpkg.com) and [Lerna](https://lerna.js.org/).

### Install dependencies

This is needed the **first time** you get the projet to install all dependencies.

```
yarn
```

### Bootstrap the repo with lerna

This is needed the **first time** you get the projet to link local packages together.

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

So instead you can go in each packages folders and run test from here.

```
cd packages/core
yarn test:dev
```