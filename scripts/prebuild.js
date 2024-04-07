import { writeFileSync, mkdirSync } from "fs"

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

const URL_KaTex_js = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
const URL_KaTex_css = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
const URL_KaTex_fonts_prefix = "https://raw.githubusercontent.com/KaTeX/KaTeX/main/fonts"
const KaTeX_font_names = [
    "KaTeX_AMS-Regular.woff2",
    "KaTeX_Caligraphic-Bold.woff2",
    "KaTeX_Caligraphic-Regular.woff2",
    "KaTeX_Fraktur-Bold.woff2",
    "KaTeX_Fraktur-Regular.woff2",
    "KaTeX_Main-Bold.woff2",
    "KaTeX_Main-BoldItalic.woff2",
    "KaTeX_Main-Italic.woff2",
    "KaTeX_Main-Regular.woff2",
    "KaTeX_Math-BoldItalic.woff2",
    "KaTeX_Math-Italic.woff2",
    "KaTeX_SansSerif-Bold.woff2",
    "KaTeX_SansSerif-Italic.woff2",
    "KaTeX_SansSerif-Regular.woff2",
    "KaTeX_Script-Regular.woff2",
    "KaTeX_Size1-Regular.woff2",
    "KaTeX_Size2-Regular.woff2",
    "KaTeX_Size3-Regular.woff2",
    "KaTeX_Size4-Regular.woff2",
    "KaTeX_Typewriter-Regular.woff2",
]

fetch(URL_KaTex_js)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/katex.js", text)
    })

fetch(URL_KaTex_css)
    .then((response) => response.text())
    .then((text) => {
        writeFileSync("./prebuild/katex.css", text)
    })

mkdirSync("./prebuild/fonts", { recursive: true })

KaTeX_font_names.forEach((name) => {
    fetch(`${URL_KaTex_fonts_prefix}/${name}`)
        .then((response) => response.arrayBuffer())
        .then((bf) => {
            writeFileSync(`./prebuild/fonts/${name}`, Buffer.from(bf))
        })
})

const URL_CascadiaCode = "https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@4.2.1/files/cascadia-code-latin-ext-400-normal.woff2"
fetch(URL_CascadiaCode)
    .then((response) => response.arrayBuffer())
    .then((bf) => {
        writeFileSync("./prebuild/fonts/CascadiaCode.woff2", Buffer.from(bf))
    })
