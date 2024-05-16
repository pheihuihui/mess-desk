// https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-browser-location.js

import { useSyncExternalStore } from "react"

export type Path = string
export type SearchString = string
export type BaseLocationHook = { (...args: any[]): [Path, (path: Path, ...args: any[]) => any]; hrefs: (x: string) => string }

export type BaseSearchHook = (...args: any[]) => SearchString
export type HookReturnValue<H extends BaseLocationHook> = ReturnType<H>
type EmptyInterfaceWhenAnyOrNever<T> = 0 extends 1 & T ? {} : [T] extends [never] ? {} : T
type EmptyInterfaceWhenAnyOrNeverOrUndefined<T> = T extends undefined ? {} : EmptyInterfaceWhenAnyOrNever<T>
export type HookNavigationOptions<H extends BaseLocationHook> = EmptyInterfaceWhenAnyOrNeverOrUndefined<NonNullable<Parameters<HookReturnValue<H>[1]>[1]>>

const eventPopstate = "popstate"
const eventPushState = "pushState"
const eventReplaceState = "replaceState"
const eventHashchange = "hashchange"
const events = [eventPopstate, eventPushState, eventReplaceState, eventHashchange]

const subscribeToLocationUpdates = (callback: EventListener) => {
    for (const event of events) {
        addEventListener(event, callback)
    }
    return () => {
        for (const event of events) {
            removeEventListener(event, callback)
        }
    }
}
type Primitive = string | number | bigint | boolean | null | undefined | symbol
export const useLocationProperty: <S extends Primitive>(fn: () => S) => S = (fn) => useSyncExternalStore(subscribeToLocationUpdates, fn, undefined)

const currentSearch = () => location.search

export type BrowserSearchHook = () => SearchString

export const useBrowserSearch: BrowserSearchHook = () => useLocationProperty(currentSearch)

const currentPathname = () => location.pathname

export const usePathname = () => useLocationProperty(currentPathname)

const currentHistoryState = () => history.state
export const useHistoryState = () => useLocationProperty(currentHistoryState)

export const navigate: <S = any>(to: string | URL, options?: { replace?: boolean; state?: S }) => void = (to, { replace = false, state = null } = {}) =>
    history[replace ? eventReplaceState : eventPushState](state, "", to)

export type BrowserLocationHook = { (): [Path, typeof navigate]; hrefs: (x: string) => string }

export const useBrowserLocation: BrowserLocationHook = () => [usePathname(), navigate]
useBrowserLocation.hrefs = (x: string) => x

const patchKey = Symbol.for("simple-router-patch")

if (typeof history !== "undefined" && typeof window[patchKey] === "undefined") {
    for (const type of [eventPushState, eventReplaceState]) {
        const original = history[type]
        history[type] = function () {
            const result = original.apply(this, arguments)
            const event = new Event(type)
            event.arguments = arguments
            dispatchEvent(event)
            return result
        }
    }
    Object.defineProperty(window, patchKey, { value: true })
}
