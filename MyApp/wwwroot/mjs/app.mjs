import { createApp, reactive, ref, computed } from "vue"
import { JsonApiClient, $1, $$ } from "@servicestack/client"
import ServiceStackVue from "@servicestack/vue"
import HelloApi from "./components/HelloApi.mjs"
import SrcLink from "./components/SrcLink.mjs"

let client = null, Apps = []
let AppData = {
    init:false
}
export { client, Apps }

/** Shared Components */
const Components = {
    HelloApi,
    SrcLink,
}

const alreadyMounted = el => el.__vue_app__ 

/** Mount Vue3 Component
 * @param sel {string|Element} - Element or Selector where component should be mounted
 * @param component 
 * @param [props] {any} */
export function mount(sel, component, props) {
    if (!AppData.init) {
        init(globalThis)
    }
    const el = $1(sel)
    if (alreadyMounted(el)) return
    const app = createApp(component, props)
    app.provide('client', client)
    Object.keys(Components).forEach(name => {
        app.component(name, Components[name])
    })
    app.use(ServiceStackVue)
    app.component('RouterLink', ServiceStackVue.component('RouterLink'))
    app.mount(el)
    Apps.push(app)
    return app
}

export function mountAll() {
    $$('[data-component]').forEach(el => {
        if (alreadyMounted(el)) return
        let componentName = el.getAttribute('data-component')
        if (!componentName) return
        let component = Components[componentName] || ServiceStackVue.component(componentName)
        if (!component) {
            console.error(`Could not create component ${componentName}`)
            return
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
