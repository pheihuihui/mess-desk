import { useState, useEffect, useReducer, useRef, DependencyList, useLayoutEffect, MutableRefObject, useInsertionEffect } from "react"
import { _useIndexedDB } from "./db"
import { BaseLocationHook, BrowserLocationHook, HookReturnValue } from "./browser_location"

export function useWindowSize() {
    const [windowScale, setWindowScale] = useState({
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.9,
    })
    const handleResize = () => {
        setWindowScale({
            width: window.innerWidth * 0.7,
            height: window.innerHeight * 0.9,
        })
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return windowScale
}

interface State<T> {
    data?: T
    error?: Error
}
type Cache<T> = { [url: string]: T }
type Action<T> = { type: "loading" } | { type: "fetched"; payload: T } | { type: "error"; payload: Error }

export function useFetch<T = unknown>(url?: string, options?: RequestInit): State<T> {
    const cache = useRef<Cache<T>>({})

    const cancelRequest = useRef<boolean>(false)

    const initialState: State<T> = {
        error: undefined,
        data: undefined,
    }

    const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
        switch (action.type) {
            case "loading":
                return { ...initialState }
            case "fetched":
                return { ...initialState, data: action.payload }
            case "error":
                return { ...initialState, error: action.payload }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(fetchReducer, initialState)

    useEffect(() => {
        if (!url) {
            return
        }

        const fetchData = async () => {
            dispatch({ type: "loading" })

            if (cache.current[url]) {
                dispatch({ type: "fetched", payload: cache.current[url] })
                return
            }

            try {
                const response = await fetch(url, options)

                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                const _data = await response.json()
                const data = JSON.parse(_data) as T

                cache.current[url] = data
                if (cancelRequest.current) {
                    return
                }
                dispatch({ type: "fetched", payload: data })
            } catch (error) {
                if (cancelRequest.current) {
                    return
                }
                dispatch({ type: "error", payload: error as Error })
            }
        }

        void fetchData()
        return () => {
            cancelRequest.current = true
        }
    }, [url])

    return state
}

export function useDidUpdateEffect(fn: () => void, inputs: DependencyList | undefined) {
    const didMountRef = useRef(false)

    useEffect(() => {
        if (didMountRef.current) fn()
        else didMountRef.current = true
    }, inputs)
}

type LocalStorageKeys = "LOCAL_STORAGE_TAGS" | "LOCAL_STORAGE_IMAGE_API_ADDR" | "LOCAL_STORAGE_IMAGE_API_SESSION_ID"

export function useLocalStorage<K extends LocalStorageKeys>(key: K, initialValue: string = "") {
    const [storedValue, setStoredValue] = useState<string>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    const setValue = (value: string | ((val: string) => string)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue] as const
}

export function useLocalTags() {
    const [tagsStr, saveTagsStr] = useLocalStorage("LOCAL_STORAGE_TAGS", "[]")
    const tagsSet = new Set(JSON.parse(tagsStr) as string[])
    const addOneTag = (tag: string) => {
        tagsSet.add(tag)
        saveTagsStr(JSON.stringify(Array.from(tagsSet)))
    }
    const addMultipleTags = (tags: string[]) => {
        tags.forEach((tag) => tagsSet.add(tag))
        saveTagsStr(JSON.stringify(Array.from(tagsSet)))
    }
    return { tagsSet, addOneTag, addMultipleTags }
}

export type TPersonDate = `${number}/${number}/${number}` | "unknown" | "not yet"

interface IndexedDbProps {
    STORE_IMAGE: {
        title: string
        description?: string
        base64: string
        hash: string
        base64_compressed?: string
        hash_compressed?: string
        deleted: boolean
        tags: string[]
    }
    STORE_MARKDOWN: {
        title: string
        content: string
        tags: string[]
        deleted: boolean
    }
    STORE_PERSON: {
        name: string
        description: string
        birth: TPersonDate
        death: TPersonDate
        imgId: number
        type: "real" | "fictional" | "avatar"
        headX: number
        headY: number
        headWidth: number
        tags: string[]
        deleted: boolean
    }
}

type IndexedDbKeys = keyof IndexedDbProps
export function useIndexedDb<T extends IndexedDbKeys>(db: T) {
    return _useIndexedDB<IndexedDbProps[T]>(db)
}

export function useImageDataUrl(id: number) {
    const db = useIndexedDb("STORE_IMAGE")
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
    useEffect(() => {
        db.getByID(id).then((item) => {
            let base64 = item?.base64
            if (base64) {
                setImageDataUrl(base64)
            }
        })
    }, [])
    return imageDataUrl
}

// https://github.com/facebook/react/pull/25881#issuecomment-1356244360
export const useEvent = (fn: Function) => {
    const ref = useRef([fn, (...args: any) => ref[0](...args)]).current
    useInsertionEffect(() => {
        ref[0] = fn
    })
    return ref[1]
}

export function usePhotoPrism() {
    const [photoPrismAddr] = useLocalStorage("LOCAL_STORAGE_IMAGE_API_ADDR")
    const [photoPrismSessionId] = useLocalStorage("LOCAL_STORAGE_IMAGE_API_SESSION_ID")
    const fetch10 = () =>
        fetch(`${photoPrismAddr}/api/v1/photos?count=10`, {
            headers: {
                "X-Session-Id": photoPrismSessionId,
            },
        })
    return {
        fetch10,
    }
}
