import { SearchString } from "./browser_location"

export const relativePath = (base = "", path: SearchString) => (!path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || "/" : "~" + path)

export const absolutePath = (to: SearchString, base = "") => (to[0] === "~" ? to.slice(1) : base + to)

export const stripQm = (str: SearchString) => (str[0] === "?" ? str.slice(1) : str)

export const unescape = (str: SearchString) => {
    try {
        return decodeURI(str)
    } catch (_e) {
        // fail-safe mode: if string can't be decoded do nothing
        return str
    }
}
