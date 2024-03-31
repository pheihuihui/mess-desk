import { useState, useEffect, useReducer, useRef, DependencyList } from "react"
import { _useIndexedDB } from "./utilities/db"

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

const SettingKeysForStringValues = ["imageApi", "imageApiKey", "markdownCode"] as const
export type TSettingKeysForStringValues = (typeof SettingKeysForStringValues)[number]

export function useLocalStorage<K extends TSettingKeysForStringValues>(key: K, initialValue: string) {
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
    STORE_ARTICLE: {
        title: string
        content: string
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
