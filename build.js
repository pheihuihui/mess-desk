const es = require('esbuild')
const fs = require('fs')

const dir_client = './dist'

if (fs.existsSync(dir_client)) {
    fs.rmSync(dir_client, { recursive: true })
}

fs.mkdirSync(dir_client, { recursive: true })
fs.copyFileSync('./resources/favicon.ico', `${dir_client}/favicon.ico`)
fs.copyFileSync('./resources/main.html', `${dir_client}/main.html`)
fs.copyFileSync('./resources/client.css', `${dir_client}/client.css`)
fs.copyFileSync('./resources/comrak.wasm', `${dir_client}/comrak.wasm`)

es.buildSync({
    entryPoints: ['./src/index.ts'],
    outfile: `${dir_client}/client.js`,
    minify: false,
    bundle: true,
    tsconfig: './tsconfig.json',
    platform: 'browser',
    treeShaking: true
})
