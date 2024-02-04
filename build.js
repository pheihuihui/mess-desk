import es from "esbuild"
import fs from "fs"
import * as sass from "sass"

const dir_client = "./dist"
const pkg_wasm = "markdown_reader_bg.wasm"
const pkg_js = "markdown_reader.js"

if (fs.existsSync(dir_client)) {
    fs.rmSync(dir_client, { recursive: true })
}

fs.mkdirSync(dir_client, { recursive: true })
fs.copyFileSync("./resources/favicon.ico", `${dir_client}/favicon.ico`)
fs.copyFileSync("./resources/index.html", `${dir_client}/index.html`)
fs.copyFileSync("./resources/sample.md", `${dir_client}/sample.md`)

const styles = sass.compile("./src/styles/_index.scss")
fs.writeFileSync(`${dir_client}/client.css`, styles.css)

const dir_assets = "./assets"
fs.cpSync(dir_assets, `${dir_client}/assets`, { recursive: true })

fs.cpSync(`./prebuild/pkg/${pkg_wasm}`, `${dir_client}/pkg/${pkg_wasm}`)
fs.cpSync(`./prebuild/pkg/${pkg_js}`, `${dir_client}/pkg/${pkg_js}`)

es.buildSync({
    entryPoints: ["./src/index.ts"],
    outfile: `${dir_client}/client.js`,
    minify: false,
    bundle: true,
    tsconfig: "./tsconfig.json",
    platform: "browser",
    treeShaking: true,
})
