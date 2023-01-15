import { createApp, reactive } from "vue"
import { JsonServiceClient, $1, $$ } from "@servicestack/client"
import ServiceStackVue, { useClient, RouterLink } from "@servicestack/vue"
import { Authenticate } from "./dtos.mjs"
import SrcLink from "./components/SrcLink.js"

let client = null, AppData = { init:false, loaded:false }, Apps = []
export { client, AppData, Apps, useClient }

/** Shared Components */
const Components = {
    RouterLink,
    SrcLink,
}

/** Mount Vue3 Component
 * @param sel {string|Element} - Element or Selector where component should be mounted
 * @param component 
 * @param [props] {any} */
export function mount(sel, component, props) {
    if (!AppData.init) {
        init(window)
    }
    const el = $1(sel)
    const app = createApp(component, props)
    app.provide('client', client)
    app.provide('AppData', AppData)
    Object.keys(Components).forEach(name => {
        app.component(name, Components[name])
    })
    app.use(ServiceStackVue)
    app.mount(el)
    Apps.push(app)
    return app
}

/** @param [exports] */
export function init(exports) {
    client = new JsonServiceClient().apply(c => {
        c.basePath = "/api"
        c.headers = new Headers() //avoid pre-flight CORS requests
    })
    AppData = reactive(AppData)
    AppData.init = true

    $$('[data-component]').forEach(el => {
        let componentName = el.getAttribute('data-component')
        let component = componentName && Components[componentName]
        if (!component) {
            console.error(`Could not create component ${componentName}`)
            return
        }

        let propsStr = el.getAttribute('data-props')
        let props = propsStr && new Function(`return (${propsStr})`)() || {}
        mount(el, component, props)
    })

    client.api(new Authenticate())
        .then(api => {
            AppData.Auth = api.succeeded ? api.response : null
            AppData.loaded = true
        })
    
    if (exports) {
        exports.client = client
        exports.AppData = AppData
        exports.Apps = Apps
    }
}
