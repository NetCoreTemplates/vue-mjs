import { createApp, reactive, ref, computed } from "vue"
import { JsonApiClient, $1, $$ } from "@servicestack/client"
import ServiceStackVue, { RouterLink, useAppMetadata } from "@servicestack/vue"
import HelloApi from "./components/HelloApi.mjs"
import SrcLink from "./components/SrcLink.js"

let client = null, Apps = []
let AppData = {
    init:false
}
export { client, Apps }

/** Simple inline component examples */
const Hello = {
    template: `<b>Hello, {{name}}!</b>`,
    props: { name:String }
}
const Counter = {
    template: `<b @click="count++">Counter {{count}}</b>`,
    setup() {
        let count = ref(1)
        return { count }
    }
}
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

/** Shared Components */
const Components = {
    RouterLink,
    HelloApi,
    SrcLink,
    Hello,
    Counter,
    Plugin,
}

/** Mount Vue3 Component
 * @param sel {string|Element} - Element or Selector where component should be mounted
 * @param component 
 * @param [props] {any} */
export function mount(sel, component, props) {
    if (!AppData.init) {
        init(globalThis)
    }
    const el = $1(sel)
    const app = createApp(component, props)
    app.provide('client', client)
    Object.keys(Components).forEach(name => {
        app.component(name, Components[name])
    })
    app.use(ServiceStackVue)
    app.mount(el)
    Apps.push(app)
    return app
}

export function mountAll() {
    $$('[data-component]').forEach(el => {
        if (el.hasAttribute('data-v-app')) return
        let componentName = el.getAttribute('data-component')
        let component = componentName && Components[componentName]
        if (!component) {
            /** @type any */
            const resolver = { component(name,c) { if (name === componentName) component = c } }
            ServiceStackVue.install(resolver)
            if (!component) {
                console.error(`Could not create component ${componentName}`)
                return
            }
        }

        let propsStr = el.getAttribute('data-props')
        let props = propsStr && new Function(`return (${propsStr})`)() || {}
        mount(el, component, props)
    })
}

/** @param {any} [exports] */
export function init(exports) {
    if (AppData.init) return
    client = JsonApiClient.create()
    AppData = reactive(AppData)
    AppData.init = true
    mountAll()

    if (exports) {
        exports.client = client
        exports.Apps = Apps
    }
}
