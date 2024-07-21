import { IndexedDBProps } from "./db"

export const SITES = [".wikipedia.org", ".zhihu.com", ".reddit.com", "other"] as const
export const LOADING_IMAGE = "./assets/loading.jpg"
export const LOADING_FACE = "./assets/face.png"
export const DB_CONFIG: IndexedDBProps = {
    name: "MessDB",
    version: 2,
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

export const TAG_KEYS = {
    ENTER: [10, 13],
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27,
    SPACE: 32,
    COMMA: 188,
}

export const TAG_SEPARATORS = {
    ENTER: "Enter",
    TAB: "Tab",
    COMMA: ",",
    SPACE: " ",
    SEMICOLON: ";",
}

export const TAG_DEFAULT_PLACEHOLDER = "Press enter to add new tag"

export const TAG_DEFAULT_LABEL_FIELD = "text"

export const TAGGING_CLASSNAMES = {
    TAGS: "tagging-tags",
    TAG_INPUT: "tagging-tag-input",
    TAG_INPUT_FIELD: "tagging-tag-input-field",
    SELECTED: "tagging-selected",
    TAG: "tagging-tag",
    REMOVE: "tagging-remove",
    SUGGESTIONS: "tagging-suggestions",
    ACTIVE_SUGGESTION: "tagging-suggestion-active",
    EDITTAG_INPUT: "tagging-edit-tag-input",
    EDITTAG_INPUT_FIELD: "tagging-edit-tag-input-field",
    CLEAR_ALL: "tagging-clear-all",
}

export const TAG_INPUT_FIELD_POSITIONS = {
    INLINE: "inline",
    TOP: "top",
    BOTTOM: "bottom",
}

export const TAG_ERRORS = {
    TAG_LIMIT: "Tag limit reached!",
}
