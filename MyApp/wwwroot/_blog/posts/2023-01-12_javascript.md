---
title: Modern JavaScript
summary: Learn about JS Modules, Vue 3 and available rich UI Components
tags: js,dev
splash: https://images.unsplash.com/photo-1497515114629-f71d768fd07c?crop=entropy&fit=crop&h=1000&w=2000
author: Brandon Foley
---

<svg class="sm:float-left mr-8 w-24 h-24" style="margin-top:0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 630">
<rect width="630" height="630" fill="#f7df1e"/>
<path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z"/>
</svg>

JavaScript has progressed significantly in recent times where many of the tooling & language enhancements
that we used to rely on external tools for is now available in modern browsers alleviating the need for
complex tooling and npm dependencies that have historically plagued modern web development.

The good news is that the complex npm tooling that was previously considered mandatory in modern JavaScript App 
development can be considered optional as we can now utilize modern browser features like  
[async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function),
[JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), 
[dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), 
[import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
and [modern language features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) for a 
sophisticated development workflow without the need for any npm build tools. 

### Brining Simplicity Back

This template focuses on simplicity and eschews many aspects that has complicated modern JavaScript development,
specifically:

 - No npm node_modules or build tools
 - No client side routing
 - No heavy client state

Effectively abandoning the traditional SPA approach in lieu of a simpler [MPA](https://docs.astro.build/en/concepts/mpa-vs-spa/) 
development model using Razor Pages for Server Rendered content with any interactive UIs progressively enhanced with JavaScript.

#### Freedom to use any JS library

Avoiding the SPA route ends up affording more flexibility on which JS libraries each page can use as without a heavy bundled JS
blob of all JS used by the entire App, it's free to only load the required JS each page needs to best implement its 
required functionality, which can be any JS library, preferably utilizing ESM builds that can be referenced from a 
[JavaScript Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), taking advantage of the module system
native to modern browsers able to efficiently download the declarative matrix of dependencies each script needs. 

### Best libraries for progressive Multi Page Apps

By default this template includes collection of libraries we believe offers the best modern development experience in Progressive
MPA Web Apps, specifically:

#### [Tailwind CLI](https://tailwindcss.com/docs/installation)
Tailwind enables a responsive, utility-first CSS framework for creating maintainable CSS at scale without the need for any CSS
preprocessors like Sass, which is configured to run from an npx script to avoid needing any node_module dependencies.

#### [Vue 3](https://vuejs.org/guide/introduction.html)
Vue is a popular Progressive JavaScript Framework that makes it easy to create interactive Reactive Components whose
[Composition API](https://vuejs.org/api/composition-api-setup.html) offers a nice development model without requiring any
pre-processors like JSX.

Where creating a component is as simple as:

```js
const Hello = {
    template: `<b>Hello, {{name}}!</b>`,
    props: { name:String }
}
```
<div data-component="Hello" data-props="{ name: 'Vue 3' }" class="text-center text-2xl py-2"></div>

Or a simple reactive example:

```js
const Counter = {
    template: `<b @click="count++">Counter {{count}}</b>`,
    setup() {
        let count = ref(1)
        return { count }
    }
}
```

<div data-component="Counter" class="text-center text-2xl py-2 cursor-pointer select-none"></div>

These components can be mounted using the standard [Vue 3 mount](https://vuejs.org/api/application.html#app-mount) API, but to 
make it easier we've added additional APIs for declaratively mounting components to pages using the `data-component` and `data-props`
attributes, especially useful for including Vue components in Markdown content, e.g:  

```html
<div data-component="Hello" data-props="{ name: 'Vue 3' }"></div>
```

Alternatively they can be programatically added using the custom `mount` method in `api.mjs`:

```js
import { mount } from "/mjs/api.mjs"
mount('#counter', Counter)
```

Both methods create components with access to all your Shared Components and any 3rd Party Plugins which
we can preview in this example that uses the `ModuleDialog` component from **@servicestack/vue**:

```js
const Plugin = {
    template:`<div>
        <b @click="show=true">Open Modal</b>
        <ModalDialog v-if="show" @done="show=false">
            <div class="p-8">Hello @servicestack/vue!</div>
        </ModalDialog>
    </div>`,
    setup() {
        const show = ref(false)
        return { show }
    }
}
```

<div data-component="Plugin" class="text-center text-2xl py-2 cursor-pointer select-none"></div>

#### [@serviceStack/vue](https://github.com/ServiceStack/servicestack-vue)
`@serviceStack/vue` is our growing Vue 3 Tailwind component library with many rich components useful in ServiceStack
Apps, including Input Components with auto form validation binding which is used by all forms in this template. 

#### [@serviceStack/client](https://github.com/ServiceStack/servicestack-client)
`@serviceStack/client` is our generic [JS/TypeScript](https://docs.servicestack.net/typescript-add-servicestack-reference) client library
which enables a terse, typed API that requires **no build steps** which can use your App's typed DTOs from the built-in `/types/mjs` endpoint 
to enable an effortless end-to-end Typed development model for calling your APIs, e.g:

```html
<input type="text" id="txtName">
<div id="result"></div>

<script type="module">
import { JsonServiceClient, $1, on } from '@servicestack/client'
import { Hello } from '/types/mjs'

on('#txtName', {
    async keyup(el) {
        const client = new JsonServiceClient()
        const api = await client.api(new Hello({ name:el.target.value }))
        $1('#result').innerHTML = api.response.result
    }
})
</script>
```

For better IDE intelli-sense during development, save the annotated Typed DTOs to disk with:

```bash
$ npm run dtos
```

That can be referenced instead to enable IDE static analysis benefits during development:

```js
import { Hello } from '/js/dtos.mjs'
client.api(new Hello({ name }))
```

You'll typically use all these libraries in your **API-enabled** components as seen in the 
[HelloApi.mjs](https://github.com/NetCoreTemplates/razor-tailwind/blob/main/MyApp/wwwroot/mjs/components/HelloApi.mjs)
component on the home page which calls the [Hello](/ui/Hello) API on every key press:

```js
import { ref } from "vue"
import { useClient } from "@servicestack/vue"
import { Hello } from "../dtos.mjs"

export default {
    template:/*html*/`<div class="flex flex-wrap justify-center">
        <TextInput v-model="name" @keyup="update" />
        <div class="ml-3 mt-2 text-lg">{{ result }}</div>
    </div>`,
    props:['value'],
    setup(props) {
        let name = ref(props.value)
        let result = ref('')
        let client = useClient()

        async function update() {
            let api = await client.api(new Hello({ name }))
            if (api.succeeded) {
                result.value = api.response.result
            }
        }
        update()

        return { name, update, result }
    }
}
```

Which we can also mount below:

<div data-component="HelloApi" data-props="{ value: 'Vue 3' }" class="w-full font-semibold"></div>

We'll also go through and explain other features used in this component:

#### `/*html*/`

Although not needed in [Rider](/rider) (which can automatically infer HTML in strings), the `/*html*/` type hint can be used 
to instruct tooling like the [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)
VS Code extension to provide syntax highlighting and an enhanced authoring experience for HTML content in string literals. 

#### useClient

[useClient()](https://github.com/ServiceStack/servicestack-vue/blob/main/src/api.ts) provides managed APIs around the `JsonServiceClient` 
instance registered in Vue App's with:

```js
app.provide('client', client)
```

Which maintains contextual information around your API calls like **loading** and **error** states, used by `@servicestack/vue` components to 
enable its auto validation binding. Other functionality in this provider include:

```js
let { 
    api, apiVoid, apiForm, apiFormVoid, // Managed Typed ServiceClient APIs
    loading, error,                     // Maintains 'loading' and 'error' states
    setError, addFieldError,            // Add custom errors in client
    unRefs                              // Returns a dto with all Refs unwrapped
} = useClient()
```

Typically you would need to unwrap `ref` values when calling APIs, i.e:

```js
let client = new JsonServiceClient()
let api = await client.api(new Hello({ name:name.value }))
```

#### useClient - api

This is unnecessary in useClient `api*` methods which automatically unwraps ref values, allowing for the more pleasant API call:

```js
let api = await client.api(new Hello({ name }))
```

#### useClient - unRefs

But as DTOs are typed, passing reference values will report a type annotation warning in IDEs with type-checking enabled, 
which can be avoided by explicitly unwrapping DTO ref values with `unRefs`:

```js
let api = await client.api(new Hello(unRefs({ name })))
```

#### useClient - setError

`setError` can be used to populate client-side validation errors which the 
[SignUp.mjs](https://github.com/NetCoreTemplates/razor-tailwind/blob/main/MyApp/wwwroot/Pages/SignUp.mjs)
component uses to report an invalid submissions when passwords don't match:

```js
const { api, setError } = useClient()
async function onSubmit() {
    if (password.value !== confirmPassword.value) {
        setError({ fieldName:'confirmPassword', message:'Passwords do not match' })
        return
    }
    //...
}
```

### Form Validation

All `@servicestack/vue` Input Components support contextual validation binding that's typically populated from API
[Error Response DTOs](https://docs.servicestack.net/error-handling) but can also be populated from client-side validation
as done above.

#### Explicit Error Handling

This populated `ResponseStatus` DTO can either be manually passed into each component's **status** property as done in [/Todos](/TodoMvc):

```html
<template id="TodoMvc-template">
    <div class="mb-3">
        <text-input :status="store.error" id="text" label="" placeholder="What needs to be done?"
                    v-model="store.newTodo" v-on:keyup.enter.stop="store.addTodo()"></text-input>
    </div>
    <!-- ... -->
</template>
```

Where if you try adding an empty Todo the `CreateTodo` API will fail and populate its `store.error` reactive property with the 
APIs Error Response DTO which the `<TextInput />` component checks for to display any field validation errors matching the
field in `id` adjacent to the HTML Input:

```js
let store = {
    /** @type {Todo[]} */
    todos: [],
    newTodo:'',
    error:null,
    async refreshTodos(errorStatus) {
        this.error = errorStatus
        let api = await client.api(new QueryTodos())
        if (api.succeeded)
            this.todos = api.response.results
    },
    async addTodo() {
        this.todos.push(new Todo({ text:this.newTodo }))
        let api = await client.api(new CreateTodo({ text:this.newTodo }))
        if (api.succeeded)
            this.newTodo = ''
        return this.refreshTodos(api.error)
    },
    //...
}
```

#### Implicit Error Handling

More often you'll want to take advantage of the implicit validation support in `useClient()` which makes its state available to child
components, alleviating the need to explicitly pass it in each component as seen in the [/Contacts](/Contacts) `Edit` component
which doesn't do any manual error handling:

```js
const Edit = {
    template:/*html*/`<SlideOver @done="close" title="Edit Contact">
    <form @submit.prevent="submit">
      <input type="submit" class="hidden">
      <fieldset>
        <ErrorSummary :except="visibleFields" class="mb-4" />
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="title" v-model="request.title" :options="enumOptions('Title')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput id="name" v-model="request.name" required placeholder="Contact Name" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="color" v-model="request.color" :options="colorOptions" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <SelectInput id="favoriteGenre" v-model="request.favoriteGenre" :options="enumOptions('FilmGenre')" />
          </div>
          <div class="col-span-6 sm:col-span-3">
            <TextInput type="number" id="age" v-model="request.age" />
          </div>
        </div>
      </fieldset>
    </form>
    <template #footer>
      <div class="flex justify-between space-x-3">
        <div><ConfirmDelete @delete="onDelete">Delete</ConfirmDelete></div>
        <div><PrimaryButton @click="submit">Update Contact</PrimaryButton></div>
      </div>
    </template>
  </SlideOver>`,
    props:['contact'],
    emits:['done'],
    setup(props, { emit }) {
        const visibleFields = "title,name,color,filmGenres,age,agree"
        const client = useClient()

        const request = ref(new UpdateContact(props.contact))
        const colorOptions = propertyOptions(getProperty('CreateContact','Color'))

        /** @param {Event} e */
        const submit = async (e) => {
            const api = await client.api(request.value)
            if (api.succeeded) close()
        }
        const onDelete = async () => {
            const api = await client.apiVoid(new DeleteContact({id: props.id}))
            if (api.succeeded) close()
        }
        const close = () => emit('done')
        return { visibleFields, submit, close, enumOptions, colorOptions, request }
    }
}
```

This effectively makes form validation binding a transparent detail where all `@servicestack/vue` 
Input Components are able to automatically apply contextual validation errors next to the fields they apply to: 

![](https://raw.githubusercontent.com/ServiceStack/docs/master/docs/images/scripts/edit-contact-validation.png)

#### [JSDoc](https://jsdoc.app)

We get great value from using [TypeScript](https://www.typescriptlang.org) to maintain our libraries typed code bases, however it 
does mandate using an external tool to convert it to valid JS before it can be run, something this template expressly avoids. 

Instead this template uses JSDoc to add type annotations to App code where they add value, which  at the cost of slightly more 
verbose syntax enables much of the same static analysis and intelli-sense benefits of TypeScript, but without needing any tools 
to convert it to valid JavaScript:   

```js
/** @param {KeyboardEvent} e */
function validateSafeName(e) {
    if (e.key.match(/[\W]+/g)) {
        e.preventDefault()
        return false
    }
}
```

#### TypeScript Language Service

Whilst the code-base doesn't use TypeScript syntax in its code base directly, it still TypeScript's language services to enable
static analysis for the included libraries from the TypeScript definitions included in `/lib/typings`, downloaded 
in [postinstall.js](https://github.com/NetCoreTemplates/razor-tailwind/blob/main/MyApp/postinstall.js) after installing the template.

### Import Maps

[Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) is a useful browser feature that allows
specifying optimal names for modules, that can be used to map package names to the implementation it should use, e.g:

```csharp
@Html.StaticImportMap(new() {
    ["vue"]                  = "/lib/mjs/vue.mjs",
    ["@servicestack/client"] = "/lib/mjs/servicestack-client.mjs",
    ["@servicestack/vue"]    = "/lib/mjs/servicestack-vue.mjs",
})
```

Where they can be freely maintained in one place without needing to update any source code references.
This allows source code to be able to import from the package name instead of its physical location:

```js
import { ref } from "vue"
import { useClient } from "@servicestack/vue"
import { JsonServiceClient, $1, on } from "@servicestack/client"
```

It's a great solution for specifying using local unminified debug builds during **Development**, and more optimal CDN hosted 
production builds when running in **Production**, alleviating the need to rely on complex build tools to perform this code transformation for us:

```csharp
@Html.ImportMap(new()
{
    ["vue"]                  = ("/lib/mjs/vue.mjs",                 "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"),
    ["@servicestack/client"] = ("/lib/mjs/servicestack-client.mjs", "https://unpkg.com/@servicestack/client@1/dist/servicestack-client.min.mjs"),
    ["@servicestack/vue"]    = ("/lib/mjs/servicestack-vue.mjs",    "https://unpkg.com/@servicestack/vue@3/dist/servicestack-vue.min.mjs")
})
```

#### Polyfill for Safari

Unfortunately Safari is the last modern browser to [support import maps](https://caniuse.com/import-maps) which is only now in
Technical Preview. Luckily this feature can be polyfilled with the [ES Module Shims](https://github.com/guybedford/es-module-shims)
that's configured in this template:

```html
@if (Context.Request.Headers.UserAgent.Any(x => x.Contains("Safari")))
{
    <script async src="https://ga.jspm.io/npm:es-module-shims@1.6.3/dist/es-module-shims.js"></script>
}
```

### Fast Component Loading

SPAs are notorious for being slow to load due to needing to download large blobs of JavaScript bundles that it needs to initialize
with their JS framework to mount their App component before it starts fetching the data from the server it needs to render its components. 

A complex solution to this problem is to server render the initial HTML content then re-render it again on the client after the page loads. 
A simpler solution is to just embed the JSON data the component needs in the page that loads it, which is what [/Todos](/TodoMvc) does
to load its initial list of todos using the [Service Gateway](https://docs.servicestack.net/service-gateway) to invoke your APIs in process
that can be rendered as unescaped JSON with the `AsRawJson()` extension method:

```html
<script>todos = @((await Gateway.SendAsync(new QueryTodos())).Results.AsRawJson())</script>
<script type="module">
import TodoMvc from "/Pages/TodoMvc.mjs"
import { mount } from "/mjs/app.mjs"
mount('#todomvc', TodoMvc, { todos })
</script>
```

The result of which should render the List of Todos instantly when the page loads since it doesn't need to perform any additional Ajax requests
after the component is loaded.

### App Server Metadata

The rich server metadata about your APIs that's used to generate your App's DTOs in 
[Multiple Programming Languages](https://docs.servicestack.net/add-servicestack-reference) or power the built-in 
[API Explorer UIs](https://docs.servicestack.net/api-explorer) are also available to your App where it can be embedded in pages 
that need them with:

```html
<script>window.Server=@Gateway.Send(new MetadataApp()).ToJson().AsRaw()</script>
```

Which you'll be able to access with the helper functions in `types.mjs`:

```js
import { getAppMetadata, getType, getProperty, propertyOptions, enumOptions } from "/mjs/types.mjs"
```

For example you can use this to print out all the C# property names and their Types for the `Contact` C# DTO with:

```js
getType('Contact').properties.forEach(prop => console.log(`${prop.name}: ${prop.type}`))
```

More usefully this can be used to avoid code maintenance and duplication efforts from maintaining enum values on both server
and client forms. 

An example of this is in the [/Contacts](/Contacts) component which uses the server metadata to populate the **Title** and
**Favorite Genre** select options from the `Title` and `FilmGenre` enums:

```html
<div class="grid grid-cols-6 gap-6">
  <div class="col-span-6 sm:col-span-3">
    <SelectInput id="title" v-model="request.title" :options="enumOptions('Title')" />
  </div>
  <div class="col-span-6 sm:col-span-3">
    <TextInput id="name" v-model="request.name" required placeholder="Contact Name" />
  </div>
  <div class="col-span-6 sm:col-span-3">
    <SelectInput id="color" v-model="request.color" :options="colorOptions" />
  </div>
  <div class="col-span-6 sm:col-span-3">
    <SelectInput id="favoriteGenre" v-model="request.favoriteGenre" :options="enumOptions('FilmGenre')" />
  </div>
  <div class="col-span-6 sm:col-span-3">
    <TextInput type="number" id="age" v-model="request.age" />
  </div>
</div>
```

Whilst the `colorOptions` gets its values from the available options on the `CreateContact.Color` property:    

```js
import { getProperty, propertyOptions, enumOptions } from "/mjs/types.mjs"
const Edit = {
    //...
    setup(props) {
        const colorOptions = propertyOptions(getProperty('CreateContact','Color'))
        return { enumOptions, colorOptions }
        //..
    }
}
```

Which instead of an enum, references the C# Dictionary in:

```csharp
public class CreateContact : IPost, IReturn<CreateContactResponse>
{
    [Input(Type="select", EvalAllowableEntries = "AppData.Colors")]
    public string? Color { get; set; }
    //...
}
```

To return a C# Dictionary of custom colors defined in:

```csharp
public class AppData
{
    public static readonly AppData Instance = new();
    public Dictionary<string, string> Colors { get; } = new() {
        ["#F0FDF4"] = "Green",
        ["#EFF6FF"] = "Blue",
        ["#FEF2F2"] = "Red",
        ["#ECFEFF"] = "Cyan",
        ["#FDF4FF"] = "Fuchsia",
    };
}
```

Incidentally this same metadata is also used to populate the [Create Contact](/ui/CreateContact) and [Update Contact](/ui/UpdateContact) 
auto forms in the built-in [API Explorer](https://docs.servicestack.net/api-explorer).
