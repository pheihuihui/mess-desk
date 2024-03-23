import { writeFileSync } from "fs"

const URL_PREFIX = "https://raw.githubusercontent.com/pheihuihui/markdown-reader/main/pkg"
const URL_markdown_reader_d_ts = `${URL_PREFIX}/markdown_reader.d.ts`
const URL_markdown_reader_js = `${URL_PREFIX}/markdown_reader.js`
const URL_markdown_reader_bg_js = `${URL_PREFIX}/markdown_reader_bg.js`
const URL_markdown_reader_bg_wasm = `${URL_PREFIX}/markdown_reader_bg.wasm`
const URL_markdown_reader_bg_wasm_d_ts = `${URL_PREFIX}/markdown_reader_bg.wasm.d.ts`

fetch(URL_markdown_reader_d_ts)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/markdown_reader.d.ts", text)
    })

fetch(URL_markdown_reader_js)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/markdown_reader.js", text)
    })

fetch(URL_markdown_reader_bg_js)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/markdown_reader_bg.js", text)
    })

fetch(URL_markdown_reader_bg_wasm_d_ts)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/markdown_reader_bg.wasm.d.ts", text)
    })

fetch(URL_markdown_reader_bg_wasm)
    .then((response) => response.arrayBuffer())
    .then((bf) => {
        writeFileSync("./prebuild/markdown_reader_bg.wasm", Buffer.from(bf))
    })

const URL_KaTex = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"

fetch(URL_KaTex)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/katex.js", text)
    })
