import { IndexedDBProps } from "./db"

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
                { name: "base64", keypath: "base64", options: { unique: true } },
                { name: "hash", keypath: "hash", options: { unique: true } },
                { name: "base64_compressed", keypath: "base64_compressed", options: { unique: false } },
                { name: "hash_compressed", keypath: "hash_compressed", options: { unique: false } },
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
        {
            store: "STORE_PERSON",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "description", keypath: "description", options: { unique: false } },
                { name: "birth", keypath: "birth", options: { unique: false } },
                { name: "death", keypath: "death", options: { unique: false } },
                { name: "imgId", keypath: "imgId", options: { unique: false } },
                { name: "tags", keypath: "tags", options: { unique: false } },
                { name: "deleted", keypath: "deleted", options: { unique: false } },
            ],
        },
    ],
}
