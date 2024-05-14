import { useSyncExternalStore } from "react"

import { Path } from "./browser_location"

type AnyFunction = (...args: any[]) => any

const listeners = {
    v: [] as AnyFunction[],
}

const onHashChange = () => listeners.v.forEach((cb: AnyFunction) => cb())

const subscribeToHashUpdates = (callback: AnyFunction) => {
    if (listeners.v.push(callback) === 1) addEventListener("hashchange", onHashChange)

    return () => {
        listeners.v = listeners.v.filter((i) => i !== callback)
        if (!listeners.v.length) removeEventListener("hashchange", onHashChange)
    }
}

const currentHashLocation = () => "/" + location.hash.replace(/^#?\/?/, "")

// @ts-ignore
export const navigate: <S = any>(to: Path, options?: { state: S }) => void = (to, { state = null } = {}) => {
    history.replaceState(state, "", location.pathname + location.search + (location.hash = `#/${to.replace(/^#?\/?/, "")}`))
}

export const useHashLocation = () => [useSyncExternalStore(subscribeToHashUpdates, currentHashLocation, () => "/"), navigate] as [Path, typeof navigate]

useHashLocation.hrefs = (href: string) => "#" + href
