import { hashBlob } from "./utilities"

const DESQ_STORES = ["STORE_IMAGES", "STORE_THUMBNAILS", "STORE_FILES", "STORE_IMAGE_INFO"] as const
type DESQ_STORE_TYPE = (typeof DESQ_STORES)[number]

interface I_Image {
    id?: number
    image: Blob
    hash: string
}

interface I_Thumbnail {
    id?: number
    image: Blob
    hash: string
}

interface I_File {
    id?: number
    file: Blob
    hash: string
}

interface I_Image_Info {
    id?: number
    image: number
    thumbnail: number
    tags: string[]
    description: string
}

export function getFileDB(): Promise<IDBDatabase> {
    const request = indexedDB.open("filedb")
    let db: IDBDatabase

    request.onupgradeneeded = function () {
        const db = request.result
        const store = db.createObjectStore("files", { keyPath: "file_name" })
        const titleIndex = store.createIndex("by_file_name", "file_name", { unique: true })
    }

    return new Promise((resolve, reject) => {
        request.onsuccess = function () {
            db = request.result
            resolve(db)
        }
        request.onblocked = function (ev) {
            reject("blocked")
        }
        request.onerror = function () {
            reject("error")
        }
    })
}

export function getDesqDb(storeName: DESQ_STORE_TYPE, version?: number): Promise<IDBDatabase> {
    const request = indexedDB.open("DESQ_DB", version)

    request.onupgradeneeded = (evt) => {
        const db = request.result
        switch (storeName) {
            case "STORE_FILES":
            case "STORE_IMAGES":
            case "STORE_THUMBNAILS": {
                const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true })
                store.createIndex("hash", "hash", { unique: true })
                return
            }
            case "STORE_IMAGE_INFO": {
                const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true })
                store.createIndex("image", "image", { unique: true })
                store.createIndex("tags", "tags", { unique: false })
                store.createIndex("description", "description", { unique: false })
                return
            }
            default: {
                const ck: never = storeName
                throw new Error(ck)
            }
        }
    }

    return new Promise((resolve, reject) => {
        request.onsuccess = (_) => {
            const db = request.result
            resolve(db)
        }
        request.onblocked = (evt) => {
            reject("blocked: " + evt.newVersion)
        }
        request.onerror = (_) => {
            reject("error")
        }
    })
}

export function initDB() {
    getDesqDb("STORE_FILES")
        .then((db) => {
            let newver = db.version + 1
            db.close()
            return getDesqDb("STORE_IMAGES", newver)
        })
        .then((db) => {
            let newver = db.version + 1
            db.close()
            return getDesqDb("STORE_IMAGE_INFO", newver)
        })
        .then((db) => {
            let newver = db.version + 1
            db.close()
            return getDesqDb("STORE_THUMBNAILS", newver)
        })
}

export async function populateOneFile(fileName: string, content: Blob) {
    const db = await getFileDB()
    const tx = db.transaction("files", "readwrite")
    const store = tx.objectStore("files")

    store.put({ file_name: fileName, content: content })

    tx.oncomplete = function () {
        db.close()
    }
}

export async function populateOneImage(image: Blob, isThumbnail?: boolean): Promise<number> {
    const storeName: DESQ_STORE_TYPE = isThumbnail ? "STORE_THUMBNAILS" : "STORE_IMAGES"
    let hash = await hashBlob(image)
    const db = await getDesqDb(storeName)
    const tx = db.transaction([storeName], "readwrite")
    const store = tx.objectStore(storeName)
    let key = store.put({ image: image, hash: hash })
    return new Promise((resolve, reject) => {
        key.onsuccess = (_) => {
            let index = store.index("hash")
            let req = index.get(hash)
            req.onsuccess = (__) => resolve(req.result["id"])
            req.onerror = (__) => reject(-1)
        }
        key.onerror = (_) => {
            let _tx = db.transaction(storeName, "readonly")
            let _st = _tx.objectStore(storeName)
            let index = _st.index("hash")
            let req = index.get(hash)
            req.onsuccess = (__) => resolve(req.result["id"])
            req.onerror = (__) => reject(-1)
        }
    })
}

export async function fromHash(storeName: DESQ_STORE_TYPE, hash: string) {
    const db = await getDesqDb(storeName)
    const tx = db.transaction(storeName, "readonly")
    const store = tx.objectStore(storeName)
    const index = store.index("hash")
    const req = index.get(hash)
    return new Promise((resolve, reject) => {
        req.onsuccess = (_) => resolve(req.result)
        req.onerror = (ev) => console.log(ev)
    })
}

export async function populateOneImageInfo(image: Blob, tags: string[], description: string, thumb?: Blob) {
    let item: I_Image_Info = {} as I_Image_Info
    item.description = description
    item.image = await populateOneImage(image)
    if (thumb) {
        item.thumbnail = await populateOneImage(thumb, true)
    }
    item.tags = tags
    let stname: DESQ_STORE_TYPE = "STORE_IMAGE_INFO"
    let db = await getDesqDb(stname)
    let tx = db.transaction(stname, "readwrite")
    let st = tx.objectStore(stname)
    st.put(item)
}

export async function findOneFile(name: string): Promise<Blob> {
    const db = await getFileDB()
    const tx = db.transaction("files", "readonly")
    const store = tx.objectStore("files")
    const index = store.index("by_file_name")
    const request = index.get(name)
    return new Promise((resolve, reject) => {
        request.onsuccess = function () {
            const matching = request.result
            if (matching != undefined) {
                resolve(matching["content"])
            } else {
                reject("failed")
            }
        }
    })
}
