import { useState, useEffect, useReducer, useRef, DependencyList, useInsertionEffect } from "react"
import { _useIndexedDB } from "./db"

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

interface LocalStorageContent {
    LOCAL_STORAGE_TAGS: string[]
    LOCAL_STORAGE_IMAGE_API_ADDR: string
    LOCAL_STORAGE_IMAGE_API_SESSION_ID: string
    LOCAL_STORAGE_BACKGROUND_ID: number
    LOCAL_STORAGE_BACKGROUND_IMAGE_URL: string
}

export function useLocalStorage<K extends keyof LocalStorageContent>(key: K, initialValue: LocalStorageContent[K]) {
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

    return [
        storedValue as LocalStorageContent[K],
        setValue as (value: LocalStorageContent[K] | ((val: LocalStorageContent[K]) => LocalStorageContent[K])) => void,
    ] as const
}

export function useLocalTags() {
    const [tagsStr, saveTagsStr] = useLocalStorage("LOCAL_STORAGE_TAGS", [])
    const tagsSet = new Set(tagsStr)
    const addOneTag = (tag: string) => {
        tagsSet.add(tag)
        saveTagsStr(Array.from(tagsSet))
    }
    const addMultipleTags = (tags: string[]) => {
        tags.forEach((tag) => tagsSet.add(tag))
        saveTagsStr(Array.from(tagsSet))
    }
    return { tagsSet, addOneTag, addMultipleTags }
}

// export type TPersonDate = `${number}/${number}/${number}` | "unknown" | "not yet"

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
        birth: string
        death: string
        imgId: number
        type: "real" | "fictional" | "avatar"
        tags: string[]
        deleted: boolean
        headPosition: [number, number, number]
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

type AnyFunction = (...args: any) => any
export const useEvent = (fn: AnyFunction) => {
    const ref: [AnyFunction, AnyFunction] = useRef<[AnyFunction, AnyFunction]>([fn, (...args: any) => ref[0](...args)]).current
    useInsertionEffect(() => {
        ref[0] = fn
    })
    return ref[1]
}

export function useBackgroundImage() {
    const [backgroundId, setBackgroundId] = useLocalStorage("LOCAL_STORAGE_BACKGROUND_ID", -1)
    const db = useIndexedDb("STORE_IMAGE")
    const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined)
    useEffect(() => {
        const _image = async () => {
            if (backgroundId == -1) {
                return
            } else {
                let item = await db.getByID(backgroundId)
                let base64 = item?.base64
                if (base64) {
                    setBackgroundImage(base64)
                }
            }
        }
        _image()
    }, [backgroundId])
    return [backgroundImage, setBackgroundId] as const
}
