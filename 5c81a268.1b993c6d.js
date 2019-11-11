(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{150:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"rightToc",(function(){return r})),t.d(n,"default",(function(){return d}));t(59),t(32),t(23),t(24),t(60),t(0);var a=t(169);t(176);function l(){return(l=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}var i={id:"use-field",title:"useField() hook"},r=[{value:"Concept",id:"concept",children:[]},{value:"Hook values",id:"hook-values",children:[{value:"value",id:"value",children:[]},{value:"valueDebounced",id:"valuedebounced",children:[]},{value:"setValue()",id:"setvalue",children:[]},{value:"id",id:"id",children:[]},{value:"isValid",id:"isvalid",children:[]},{value:"isPristine",id:"ispristine",children:[]},{value:"isSubmitted",id:"issubmitted",children:[]},{value:"errorMessage",id:"errormessage",children:[]},{value:"errorMessages",id:"errormessages",children:[]},{value:"resetKey",id:"resetkey",children:[]}]},{value:"Field props",id:"field-props",children:[{value:"name *",id:"name-",children:[]},{value:"debounce",id:"debounce",children:[]},{value:"defaultValue",id:"defaultvalue",children:[]},{value:"keepValue",id:"keepvalue",children:[]},{value:"formatValue(fieldValue)",id:"formatvaluefieldvalue",children:[]},{value:"onChange(fieldValue)",id:"onchangefieldvalue",children:[]},{value:"required",id:"required",children:[]},{value:"validations",id:"validations",children:[]}]},{value:"PropTypes validations",id:"proptypes-validations",children:[]}],o={rightToc:r},u="wrapper";function d(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,a,l={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(l[t]=e[t]);return l}(e,["components"]);return Object(a.b)(u,l({},o,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"concept"},"Concept"),Object(a.b)("p",null,"When using the ",Object(a.b)("inlineCode",{parentName:"p"},"useField")," hook, you need to pass your component ",Object(a.b)("inlineCode",{parentName:"p"},"props")," to the hook."),Object(a.b)("p",null,"Then the hook gives you access to the field state."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"import React from 'react'\nimport { useField } from '@formiz/core'\n\nconst MyField = (props) => {\n  const {\n    value,\n    setValue,\n    isValid,\n    errorMessage,\n  } = useField(props)\n\n  return (\n    ...\n  )\n}\n")),Object(a.b)("hr",null),Object(a.b)("h2",{id:"hook-values"},"Hook values"),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"useField")," return an object with the following properties:"),Object(a.b)("h3",{id:"value"},Object(a.b)("inlineCode",{parentName:"h3"},"value")),Object(a.b)("p",null,"Get the current value of the field."),Object(a.b)("h3",{id:"valuedebounced"},Object(a.b)("inlineCode",{parentName:"h3"},"valueDebounced")),Object(a.b)("p",null,"Get the current value of the field, but sync with the debouncing.\nIt can be useful to determinate when to show error messages."),Object(a.b)("h3",{id:"setvalue"},Object(a.b)("inlineCode",{parentName:"h3"},"setValue()")),Object(a.b)("p",null,"Set the value of the field."),Object(a.b)("h3",{id:"id"},Object(a.b)("inlineCode",{parentName:"h3"},"id")),Object(a.b)("p",null,"Return a unique id."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"<label htmlFor={id}>...</label>\n<input id={id} />\n")),Object(a.b)("h3",{id:"isvalid"},Object(a.b)("inlineCode",{parentName:"h3"},"isValid")),Object(a.b)("p",null,"Returns ",Object(a.b)("inlineCode",{parentName:"p"},"true")," if the field is valid."),Object(a.b)("h3",{id:"ispristine"},Object(a.b)("inlineCode",{parentName:"h3"},"isPristine")),Object(a.b)("p",null,"Returns ",Object(a.b)("inlineCode",{parentName:"p"},"true")," if the field has not been changed."),Object(a.b)("h3",{id:"issubmitted"},Object(a.b)("inlineCode",{parentName:"h3"},"isSubmitted")),Object(a.b)("p",null,"Returns ",Object(a.b)("inlineCode",{parentName:"p"},"true")," either if the current step or the form is submitted."),Object(a.b)("h3",{id:"errormessage"},Object(a.b)("inlineCode",{parentName:"h3"},"errorMessage")),Object(a.b)("p",null,"Returns the first error message."),Object(a.b)("h3",{id:"errormessages"},Object(a.b)("inlineCode",{parentName:"h3"},"errorMessages")),Object(a.b)("p",null,"Returns all error messages."),Object(a.b)("h3",{id:"resetkey"},Object(a.b)("inlineCode",{parentName:"h3"},"resetKey")),Object(a.b)("p",null,"Allows you to put a key on elements that you want to be reinitialize when the from is reset.",Object(a.b)("br",null),"\nCan be useful for element like ",Object(a.b)("inlineCode",{parentName:"p"},"<input>")," or ",Object(a.b)("inlineCode",{parentName:"p"},"<select>"),"."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"<input key={resetKey} />\n")),Object(a.b)("hr",null),Object(a.b)("h2",{id:"field-props"},"Field props"),Object(a.b)("p",null,"When a component is created with the ",Object(a.b)("inlineCode",{parentName:"p"},"useField()")," hook,\nyou can pass the following props to the component."),Object(a.b)("h3",{id:"name-"},Object(a.b)("inlineCode",{parentName:"h3"},"name")," *"),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Required")),Object(a.b)("p",null,"The name is required to register the field in the form."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),'<Field name="myFieldName" />\n')),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Nested objects")),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"name")," props can use lodash-like dot paths to reference nested values."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"<Field name=\"fieldA\" />\n<Field name=\"fieldB\" />\n<Field name=\"myGroup.fieldA\" />\n<Field name=\"myGroup.fieldB\" />\n\n/* Form values\n{\n  fieldA: 'value',\n  fieldB: 'value',\n  myGroup: {\n    fieldA: 'value',\n    fieldB: 'value',\n  },\n}\n*/\n")),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Arrays")),Object(a.b)("p",null,"The ",Object(a.b)("inlineCode",{parentName:"p"},"name")," props allow also arrays and arrays of objects out of the box.\nUsing lodash-like bracket syntax for ",Object(a.b)("inlineCode",{parentName:"p"},"name")," allow you to handle fields in a list."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"<Field name=\"myArray[0]\" />\n<Field name=\"myArray[1]\" />\n<Field name=\"myArrayOfObjects[0].fieldA\" />\n<Field name=\"myArrayOfObjects[0].fieldB\" />\n<Field name=\"myArrayOfObjects[1].fieldA\" />\n<Field name=\"myArrayOfObjects[1].fieldB\" />\n\n/* Form values\n{\n  myArray: ['value', 'value'],\n  myArrayOfObjects: [\n    { fieldA: 'value', fieldB: 'value' },\n    { fieldA: 'value', fieldB: 'value' },\n  ],\n}\n*/\n")),Object(a.b)("h3",{id:"debounce"},Object(a.b)("inlineCode",{parentName:"h3"},"debounce")),Object(a.b)("p",null,"Number of milliseconds for debouncing validations. (default is ",Object(a.b)("inlineCode",{parentName:"p"},"100"),")."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),'<Field name="myFieldName" debounce={200} />\n')),Object(a.b)("h3",{id:"defaultvalue"},Object(a.b)("inlineCode",{parentName:"h3"},"defaultValue")),Object(a.b)("p",null,"Pass an initial value to the field."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),'<Field name="myFieldName" defaultValue="My initial value" />\n')),Object(a.b)("h3",{id:"keepvalue"},Object(a.b)("inlineCode",{parentName:"h3"},"keepValue")),Object(a.b)("p",null,"Set to ",Object(a.b)("inlineCode",{parentName:"p"},"true")," to keep the value when the field is unmounted from the DOM. (default is ",Object(a.b)("inlineCode",{parentName:"p"},"false"),")."),Object(a.b)("h3",{id:"formatvaluefieldvalue"},Object(a.b)("inlineCode",{parentName:"h3"},"formatValue(fieldValue)")),Object(a.b)("p",null,"Format the value before saving it into the internal state."),Object(a.b)("h3",{id:"onchangefieldvalue"},Object(a.b)("inlineCode",{parentName:"h3"},"onChange(fieldValue)")),Object(a.b)("p",null,"Triggered everytime that setValue() is called inside the field."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),'<Field name="myFieldName" onChange={val => console.log(val)} />\n')),Object(a.b)("h3",{id:"required"},Object(a.b)("inlineCode",{parentName:"h3"},"required")),Object(a.b)("p",null,"Shortcut for isRequired() validation"),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),'<Field name="myFieldName" required />\n<Field name="myFieldName" required="Field is required" />\n')),Object(a.b)("h3",{id:"validations"},Object(a.b)("inlineCode",{parentName:"h3"},"validations")),Object(a.b)("p",null,"An array of object with:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"rule(fieldValue, formValues)"),": Built in validation rule or custom validation function (must return ",Object(a.b)("inlineCode",{parentName:"li"},"true")," if the rule is valid)."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"deps"),": Array of external values used in the rule function (like array of dependencies in useEffect)."),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"message"),": The message if the rule is invalid.")),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"<Field\n  name=\"myFieldName\"\n  validations={[\n    {\n      rule: isRequired(),\n      message: 'Field is required',\n    },\n    {\n      rule: isNotEmptyString(),\n      message: 'Field can\\'t be empty',\n    },\n    {\n      rule: (value) => value.toLowerCase() !== 'john',\n      message: 'Field can\\'t be john',\n    },\n    {\n      rule: (value) => value !== externalValue,\n      deps: [externalValue],\n      message: 'Field can\\'t be the same as external value',\n    },\n  ]}\n/>\n")),Object(a.b)("hr",null),Object(a.b)("h2",{id:"proptypes-validations"},"PropTypes validations"),Object(a.b)("p",null,"If you using ",Object(a.b)("a",l({parentName:"p"},{href:"https://www.npmjs.com/package/prop-types"}),"prop-types")," to document props in your project,\nyou can get ",Object(a.b)("inlineCode",{parentName:"p"},"fieldPropTypes")," and ",Object(a.b)("inlineCode",{parentName:"p"},"fieldDefaultProps")," from ",Object(a.b)("inlineCode",{parentName:"p"},"@formiz/core")," to pass to your custom fields for PropTypes validations."),Object(a.b)("pre",null,Object(a.b)("code",l({parentName:"pre"},{className:"language-jsx"}),"// MyField.js\nimport React from 'react'\nimport { useField, fieldPropTypes, fieldDefaultProps } from '@formiz/core'\n\nconst MyField = (props) => {\n  // ...\n}\n\nMyField.propTypes = {\n  ...fieldPropTypes,\n  // Your custom props\n}\n\nMyField.defaultProps = {\n  ...fieldDefaultProps,\n  // Your custom props\n}\n")))}d.isMDXComponent=!0},169:function(e,n,t){"use strict";t.d(n,"a",(function(){return o})),t.d(n,"b",(function(){return c}));var a=t(0),l=t.n(a),i=l.a.createContext({}),r=function(e){var n=l.a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):Object.assign({},n,e)),t},o=function(e){var n=r(e.components);return l.a.createElement(i.Provider,{value:n},e.children)};var u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return l.a.createElement(l.a.Fragment,{},n)}},s=Object(a.forwardRef)((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,u=function(e,n){var t={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&-1===n.indexOf(a)&&(t[a]=e[a]);return t}(e,["components","mdxType","originalType","parentName"]),s=r(t),c=a,b=s[o+"."+c]||s[c]||d[c]||i;return t?l.a.createElement(b,Object.assign({},{ref:n},u,{components:t})):l.a.createElement(b,Object.assign({},{ref:n},u))}));function c(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,r=new Array(i);r[0]=s;var o={};for(var d in n)hasOwnProperty.call(n,d)&&(o[d]=n[d]);o.originalType=e,o[u]="string"==typeof e?e:a,r[1]=o;for(var c=2;c<i;c++)r[c]=t[c];return l.a.createElement.apply(null,r)}return l.a.createElement.apply(null,t)}s.displayName="MDXCreateElement"},176:function(e,n,t){"use strict";var a=t(0),l=t.n(a),i=function(){return l.a.createElement("div",{className:"callout is-warning"},"This is an"," ",l.a.createElement("strong",null,"early and alpha release")," ","of Formiz."," ","API is subject to change."," ",l.a.createElement("strong",null,"Do not use in production."))},r=t(13),o=t.n(r),u=function(e){var n=e.of;return l.a.createElement("div",{className:"callout is-warning"},"Work in Progress."," ",l.a.createElement("strong",null,n)," ","is not implemented yet.")};u.propTypes={of:o.a.string},u.defaultProps={of:"This"};var d=function(e){var n=e.of;return l.a.createElement("div",{className:"callout is-warning"},"Work in Progress."," ",l.a.createElement("strong",null,"@formiz/",n)," ","is not published on NPM yet.")};d.propTypes={of:o.a.string},d.defaultProps={of:"core"};t.d(n,"a",(function(){return i})),t.d(n,"b",(function(){return u}))}}]);