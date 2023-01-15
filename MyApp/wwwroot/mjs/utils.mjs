import { dateFmt, toDate, toDateFmt } from "@servicestack/client"

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

/** @param {number?} [n] */
export const formatCurrency = (n) => n ? formatter.format(n) : ''
/** @param {string?} [s] */
export const formatDate = (s) => s ? toDateFmt(s) : ''

/** @param {Date} d */
export const dateInputFormat = (d) => dateFmt(d).replace(/\//g,'-')

/** @param {Object} dto */
export function sanitizeForUi(dto) {
    if (!dto) return {}
    Object.keys(dto).forEach(key => {
        let value = dto[key]
        if (typeof value == 'string') {
            if (value.startsWith('/Date'))
                dto[key] = dateInputFormat(toDate(value))
        }
    })
    return dto
}
