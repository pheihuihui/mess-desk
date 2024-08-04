import es from "esbuild"
import fs from "fs"
import * as sass from "sass"

const dir_client = "./dist"

if (fs.existsSync(dir_client)) {
    fs.rmSync(dir_client, { recursive: true })
}

fs.mkdirSync(dir_client, { recursive: true })
fs.copyFileSync("./resources/favicon.ico", `${dir_client}/favicon.ico`)
fs.copyFileSync("./resources/index.html", `${dir_client}/index.html`)
fs.copyFileSync("./resources/markdown.js", `${dir_client}/markdown.js`)

const styles = sass.compile("./src/styles/_index.scss")
fs.writeFileSync(`${dir_client}/client.css`, styles.css)

const dir_assets = "./assets"
fs.cpSync(dir_assets, `${dir_client}/assets`, { recursive: true })

let wasm_files = ["markdown_reader_bg.js", "markdown_reader_bg.wasm", "markdown_reader.js"]
wasm_files.forEach((f) => {
    fs.cpSync(`./prebuild/${f}`, `${dir_client}/pkg/${f}`)
})

let katex_files = ["katex.js", "katex.css"]
katex_files.forEach((f) => {
    fs.cpSync(`./prebuild/${f}`, `${dir_client}/${f}`)
})

fs.cpSync("./prebuild/fonts", `${dir_client}/fonts`, { recursive: true })

es.buildSync({
    entryPoints: ["./src/index.ts"],
    outfile: `${dir_client}/client.js`,
    minify: false,
    bundle: true,
    tsconfig: "./tsconfig.json",
    platform: "browser",
    treeShaking: true,
})
