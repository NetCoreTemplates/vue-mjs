import { combinePaths } from "@servicestack/client"

if (window.Server == null) {
    load()
}

/** @param {boolean} [force] */
export async function load(force) {
    if (window.Server != null && !force) return
    let r = await fetch('/types/metadata.json')
    if (r.ok) {
        let json = await r.text()
        window.Server = JSON.parse(json)
    } else {
        console.error(`error loading ${r.statusText}`)
    }
}

/** @param {string} name */
export const getType = (name) => window.Server?.api.types.find(x => x.name.toLowerCase() === name.toLowerCase())

/** @param {string} name */
export function enumOptions(name) {
    /** @type {Object} */
    let to = {}
    let type = getType(name)
    if (type && type.isEnum && type.enumNames != null) {
        for (let i=0; i<type.enumNames.length; i++) {
            const name = type.enumNames[i]
            const key = (type.enumValues != null ? type.enumValues[i] : null) ?? name
            to[key] = name
        }
    }
    return to
}
