import { createRoot } from "react-dom/client"
import { _app } from "./pages/_app"
import { IndexedDBProps, initDB } from "./utilities/db"

let div = document.getElementById("rootdiv") as HTMLDivElement

const DB_CONFIG: IndexedDBProps = {
    name: "DesqDB",
    version: 1,
    objectStoresMeta: [
        {
            store: "STORE_IMAGE",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "title", keypath: "title", options: { unique: false } },
                { name: "desctiption", keypath: "desctiption", options: { unique: false } },
                { name: "base64", keypath: "base64", options: { unique: false } },
                { name: "hash", keypath: "hash", options: { unique: true } },
                { name: "base64_compressed", keypath: "base64_compressed", options: { unique: false } },
                { name: "hash_compressed", keypath: "hash_compressed", options: { unique: true } },
                { name: "deleted", keypath: "deleted", options: { unique: false } },
            ],
        },
    ],
}

initDB(DB_CONFIG)

const root = createRoot(div)
setTimeout(() => {
    root.render(_app)
}, 500)
