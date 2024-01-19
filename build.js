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

const styles = sass.compile("./src/styles/_index.scss")
fs.writeFileSync(`${dir_client}/client.css`, styles.css)

const dir_wasm_pack = "./wasm/comrak/pkg"
const dir_assets = "./assets"
fs.cpSync(dir_wasm_pack, `${dir_client}/pkg`, { recursive: true })
fs.cpSync(dir_assets, `${dir_client}/assets`, { recursive: true })

es.buildSync({
    entryPoints: ["./src/index.ts"],
    outfile: `${dir_client}/client.js`,
    minify: false,
    bundle: true,
    tsconfig: "./tsconfig.json",
    platform: "browser",
    treeShaking: true,
})
