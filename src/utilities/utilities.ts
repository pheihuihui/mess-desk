import { TAG_SEPARATORS } from "./constants"

export async function hashBlob(content: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(content)
        reader.onloadend = async function () {
            const hashBuffer = await crypto.subtle.digest("SHA-1", reader.result as BufferSource)
            const hashHex = Array.from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
            resolve(hashHex)
        }
    })
}

export async function _blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
            const base64data = reader.result as string
            resolve(base64data)
        }
    })
}

export async function getImageFromClipboard() {
    return navigator.clipboard
        .read()
        .then((items) => {
            for (let item of items) {
                if (item.types.includes("image/png")) {
                    return item.getType("image/png").then((blob) => {
                        return URL.createObjectURL(blob)
                    })
                }
            }
        })
        .catch((_) => {
            console.log("not focused")
        })
}

// https://github.com/lodash/lodash/blob/main/src/escapeRegExp.ts
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reHasRegExpChar = RegExp(reRegExpChar.source)
function escapeRegExp(str: string) {
    return str && reHasRegExpChar.test(str) ? str.replace(reRegExpChar, "\\$&") : str || ""
}

// https://github.com/lodash/lodash/blob/main/src/escape.ts
const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}
const reUnescapedHtml = /[&<>"']/g
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)
export function _escape(str: string) {
    // @ts-ignore
    return str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, (chr) => htmlEscapes[chr]) : str || ""
}

// https://github.com/react-tags/react-tags/blob/master/src/components/utils.ts
export function buildRegExpFromDelimiters(delimiters: Array<number>): RegExp {
    const delimiterChars = delimiters
        .map((delimiter) => {
            // See: http://stackoverflow.com/a/34711175/1463681
            const chrCode = delimiter - 48 * Math.floor(delimiter / 48)
            return String.fromCharCode(96 <= delimiter ? chrCode : delimiter)
        })
        .join("")
    const escapedDelimiterChars = escapeRegExp(delimiterChars)
    return new RegExp(`[${escapedDelimiterChars}]+`)
}

export function getKeyCodeFromSeparator(separator: string) {
    switch (separator) {
        case TAG_SEPARATORS.ENTER:
            // 13 is for enter key and 10 is for carriage return, this might be present when pasting from excel
            return [10, 13]
        case TAG_SEPARATORS.TAB:
            return 9
        case TAG_SEPARATORS.COMMA:
            return 188
        case TAG_SEPARATORS.SPACE:
            return 32
        case TAG_SEPARATORS.SEMICOLON:
            return 186
        // Ideally this should never happen but just in case
        // return 0 (Unidentified key)
        default:
            return 0
    }
}

export function uniq(arr: Array<any>) {
    return Array.from(new Set(arr))
}

export function isEqual(arr1: Array<any>, arr2: Array<any>) {
    return arr1.length === arr2.length && arr1.every((v, i) => v === arr2[i])
}
