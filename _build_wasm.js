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
        writeFileSync("./wasm_prebuild/markdown_reader.d.ts", text)
    })

fetch(URL_markdown_reader_js)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./wasm_prebuild/markdown_reader.js", text)
    })

fetch(URL_markdown_reader_bg_js)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./wasm_prebuild/markdown_reader_bg.js", text)
    })

fetch(URL_markdown_reader_bg_wasm_d_ts)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./wasm_prebuild/markdown_reader_bg.wasm.d.ts", text)
    })

fetch(URL_markdown_reader_bg_wasm)
    .then((response) => response.arrayBuffer())
    .then((bf) => {
        writeFileSync("./wasm_prebuild/markdown_reader_bg.wasm", Buffer.from(bf))
    })
