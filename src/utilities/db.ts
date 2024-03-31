// https://github.com/assuncaocharles/react-indexed-db

import { useMemo } from "react"

interface Options {
    storeName: string
    dbMode: IDBTransactionMode
    error: (e: Event) => any
    complete: (e: Event) => any
    abort?: any
}

enum DBMode {
    readonly = "readonly",
    readwrite = "readwrite",
}

function validateStoreName(db: IDBDatabase, storeName: string) {
    return db.objectStoreNames.contains(storeName)
}

function validateBeforeTransaction(db: IDBDatabase, storeName: string, reject: (errorMessage: string) => void) {
    if (!db) {
        reject("You need to use the openDatabase function to create a database before you query it!")
    }
    if (!validateStoreName(db, storeName)) {
        reject(`objectStore does not exists: ${storeName}`)
    }
}

function _createTransaction(db: IDBDatabase, options: Options): IDBTransaction {
    const trans: IDBTransaction = db.transaction(options.storeName, options.dbMode)
    trans.onerror = options.error
    trans.oncomplete = options.complete
    trans.onabort = options.abort
    return trans
}

function optionsGenerator(type: any, storeName: any, reject: (e: Event) => void, resolve: (e?: Event) => void): Options {
    return {
        storeName: storeName,
        dbMode: type,
        error: (e: Event) => {
            reject(e)
        },
        complete: () => {
            resolve()
        },
        abort: (e: Event) => {
            reject(e)
        },
    }
}

function createDatabaseTransaction(
    database: IDBDatabase,
    mode: DBMode,
    storeName: string,
    resolve: (e?: Event) => void,
    reject: (e: Event) => void,
    createTransaction: typeof _createTransaction = _createTransaction,
    buildOptions: typeof optionsGenerator = optionsGenerator,
) {
    const options = buildOptions(mode, storeName, reject, resolve)
    const transaction: IDBTransaction = createTransaction(database, options)
    const store = transaction.objectStore(storeName)

    return {
        store,
        transaction,
    }
}

function createReadonlyTransaction(database: IDBDatabase, store: string, resolve: (payload?: any) => void, reject: (e: Event) => void) {
    return createDatabaseTransaction(database, DBMode.readonly, store, resolve, reject)
}

function createReadwriteTransaction(database: IDBDatabase, store: string, resolve: (e?: any) => void, reject: (e: Event) => void) {
    return createDatabaseTransaction(database, DBMode.readwrite, store, resolve, reject)
}

type Key = string | number | Date | ArrayBufferView | ArrayBuffer | IDBKeyRange // IDBArrayKey
interface IndexDetails {
    indexName: string
    order: string
}
const indexedDB: IDBFactory = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB

function openDatabase(dbName: string, version: number, upgradeCallback?: (e: Event, db: IDBDatabase) => void) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(dbName, version)
        let db: IDBDatabase
        request.onsuccess = () => {
            db = request.result
            resolve(db)
        }
        request.onerror = () => {
            reject(`IndexedDB error: ${request.error}`)
        }
        if (typeof upgradeCallback === "function") {
            request.onupgradeneeded = (event: Event) => {
                upgradeCallback(event, db)
            }
        }
    })
}

function CreateObjectStore(dbName: string, version: number, storeSchemas: ObjectStoreMeta[]) {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, version)

    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
        const database: IDBDatabase = (event.target as any).result
        storeSchemas.forEach((storeSchema: ObjectStoreMeta) => {
            if (!database.objectStoreNames.contains(storeSchema.store)) {
                const objectStore = database.createObjectStore(storeSchema.store, storeSchema.storeConfig)
                storeSchema.storeSchema.forEach((schema: ObjectStoreSchema) => {
                    objectStore.createIndex(schema.name, schema.keypath, schema.options)
                })
            }
        })
        database.close()
    }
    request.onsuccess = function (e: any) {
        e.target.result.close()
    }
}

function DBOperations(dbName: string, version: number, currentStore: string) {
    // Readonly operations
    const getAll = <T>() =>
        new Promise<T[]>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store } = createReadonlyTransaction(db, currentStore, resolve, reject)
                const request = store.getAll()

                request.onerror = (error) => reject(error)

                request.onsuccess = function ({ target: { result } }: any) {
                    resolve(result as T[])
                }
            })
        })

    const getByID = <T>(id: string | number) =>
        new Promise<T>((resolve, reject) => {
            openDatabase(dbName, version).then((db: IDBDatabase) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store } = createReadonlyTransaction(db, currentStore, resolve, reject)
                const request = store.get(id)

                request.onsuccess = function (event: Event) {
                    resolve((event.target as any).result as T)
                }
            })
        })

    const openCursor = (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => {
        return new Promise<void>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store } = createReadonlyTransaction(db, currentStore, resolve, reject)
                const request = store.openCursor(keyRange)

                request.onsuccess = (event: Event) => {
                    cursorCallback(event)
                    resolve()
                }
            })
        })
    }

    const getByIndex = (indexName: string, key: any) =>
        new Promise<any>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store } = createReadonlyTransaction(db, currentStore, resolve, reject)
                const index = store.index(indexName)
                const request = index.get(key)

                request.onsuccess = (event: Event) => {
                    resolve((<IDBOpenDBRequest>event.target).result)
                }
            })
        })

    // Readwrite operations
    const add = <T>(value: T, key?: any) =>
        new Promise<number>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                const { store } = createReadwriteTransaction(db, currentStore, resolve, reject)
                const request = store.add(value, key)

                request.onsuccess = (evt: any) => {
                    key = evt.target.result
                    resolve(key)
                }

                request.onerror = (error) => reject(error)
            })
        })

    const update = <T>(value: T, key?: any) =>
        new Promise<any>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { transaction, store } = createReadwriteTransaction(db, currentStore, resolve, reject)

                transaction.oncomplete = (event) => resolve(event)

                store.put(value, key)
            })
        })

    const deleteRecord = (key: Key) =>
        new Promise<any>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store } = createReadwriteTransaction(db, currentStore, resolve, reject)
                const request = store.delete(key)

                request.onsuccess = (event) => resolve(event)
            })
        })

    const clear = () =>
        new Promise<void>((resolve, reject) => {
            openDatabase(dbName, version).then((db) => {
                validateBeforeTransaction(db, currentStore, reject)
                const { store, transaction } = createReadwriteTransaction(db, currentStore, resolve, reject)

                transaction.oncomplete = () => resolve()

                store.clear()
            })
        })

    return {
        add,
        getByID,
        getAll,
        update,
        deleteRecord,
        clear,
        openCursor,
        getByIndex,
    }
}

export interface IndexedDBProps {
    name: string
    version: number
    objectStoresMeta: ObjectStoreMeta[]
}

interface ObjectStoreMeta {
    store: string
    storeConfig: { keyPath: string; autoIncrement: boolean; [key: string]: any }
    storeSchema: ObjectStoreSchema[]
}

interface ObjectStoreSchema {
    name: string
    keypath: string
    options: { unique: boolean; [key: string]: any }
}

interface useIndexedDB {
    dbName: string
    version: number
    objectStore: string
}

const indexeddbConfiguration: { version: number; name: string } = {
    version: 1,
    name: "",
}

export function initDB({ name, version, objectStoresMeta }: IndexedDBProps) {
    indexeddbConfiguration.name = name
    indexeddbConfiguration.version = version
    Object.freeze(indexeddbConfiguration)
    CreateObjectStore(name, version, objectStoresMeta)
}

type TIndexedId = { id: string | number }
export function _useIndexedDB<T>(objectStore: string): {
    add: (value: T, key?: any) => Promise<number>
    getByID: (id: number | string) => Promise<T & TIndexedId>
    getAll: () => Promise<T[]>
    update: (value: T & TIndexedId, key?: any) => Promise<T & TIndexedId>
    deleteRecord: (key: Key) => Promise<any>
    openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>
    getByIndex: (indexName: string, key: number | string) => Promise<T & TIndexedId>
    clear: () => Promise<any>
} {
    if (!indexeddbConfiguration.name || !indexeddbConfiguration.version) {
        throw new Error("Please initialize the DB before the use.")
    }
    return useMemo(() => DBOperations(indexeddbConfiguration.name, indexeddbConfiguration.version, objectStore), [indexeddbConfiguration, objectStore])
}
