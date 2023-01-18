if (window.Server == null) {
    load()
}

/** @param {boolean} [force] */
export async function load(force) {
    if (window.Server != null && !force) return
    let r = await fetch('/metadata/app.json')
    if (r.ok) {
        let json = await r.text()
        window.Server = JSON.parse(json)
    } else {
        console.error(`error loading /metadata/app.json: ${r.statusText}`)
    }
}

/** @return {AppMetadata} */
export function getAppMetadata() { return window.Server }

/** @param {string} name
 *  @return {MetadataType} */
export function getType(name) {
    let api = window.Server?.api
    if (!api) return api
    let type = api.types.find(x => x.name.toLowerCase() === name.toLowerCase())
    if (type) return type
    let requestOp = api.operations.find(x => x.request.name.toLowerCase() === name.toLowerCase())
    if (requestOp) return requestOp.request
    let responseOp = api.operations.find(x => x.response && (x.response.name.toLowerCase() === name.toLowerCase()))
    if (responseOp) return responseOp
    return null
}

/** @param {string} typeName
 * @param {string} name
 * @return {MetadataPropertyType} */
export function getProperty(typeName, name) {
    let type = getType(typeName)
    let prop = type && type.properties && type.properties.find(x => x.name.toLowerCase() === name.toLowerCase())
    return prop
}

/** @param {string} name
 *  @return {Object.<string,string>} */
export function enumOptions(name) {
    /** @type {Object} */
    let to = {}
    let type = getType(name)
    if (type && type.isEnum && type.enumNames != null) {
        for (let i=0; i<type.enumNames.length; i++) {
            const name = (type.enumDescriptions ? type.enumDescriptions[i] : null) || type.enumNames[i]
            const key = (type.enumValues != null ? type.enumValues[i] : null) || type.enumNames[i]
            to[key] = name
        }
    }
    return to
}

/** @param {MetadataPropertyType} prop
 *  @return {Object.<string,string>} */
export function propertyOptions(prop) {
    let to = {}
    if (!prop) return to
    let allowableEntries = prop.input && prop.input.allowableEntries
    if (allowableEntries) {
        for (let i=0; i<allowableEntries.length; i++) {
            let x = allowableEntries[i]
            to[x.key] = x.value
        }
        return to
    }
    let allowableValues = prop.allowableValues || (prop.input ? prop.input.allowableValues : null)
    if (allowableValues) {
        for (let i=0; i<allowableValues.length; i++) {
            let value = allowableValues[i]
            to[value] = value
        }
    }
    return to
}
