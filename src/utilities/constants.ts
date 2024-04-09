import { IndexedDBProps } from "./db"

export const AZURE_SPEECH_API = "https://eastasia.api.cognitive.microsoft.com/sts/v1.0/issuetoken"
export const CORS_ANYWHERE = "http://192.168.1.163:8881/"
export const SITES = [".wikipedia.org", ".zhihu.com", ".reddit.com", "other"] as const
export const LOADING_IMAGE = "./loading.jpg"
export const DB_CONFIG: IndexedDBProps = {
    name: "DesqDB",
    version: 1,
    objectStoresMeta: [
        {
            store: "STORE_IMAGE",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "title", keypath: "title", options: { unique: false } },
                { name: "description", keypath: "description", options: { unique: false } },
                { name: "base64", keypath: "base64", options: { unique: false } },
                { name: "hash", keypath: "hash", options: { unique: true } },
                { name: "base64_compressed", keypath: "base64_compressed", options: { unique: false } },
                { name: "hash_compressed", keypath: "hash_compressed", options: { unique: true } },
                { name: "deleted", keypath: "deleted", options: { unique: false } },
            ],
        },
        {
            store: "STORE_MARKDOWN",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "title", keypath: "title", options: { unique: false } },
                { name: "description", keypath: "description", options: { unique: false } },
                { name: "content", keypath: "content", options: { unique: false } },
                { name: "deleted", keypath: "deleted", options: { unique: false } },
            ],
        },
    ],
}
