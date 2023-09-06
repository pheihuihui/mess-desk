const esbuild = require('esbuild')
const fs = require('fs')

let files = ['background', 'content', 'image']
files.forEach(f => {
    esbuild.buildSync({
        entryPoints: [`./chrome/${f}.ts`],
        platform: 'browser',
        treeShaking: true,
        outfile: `./dist_crx/${f}.js`,
        tsconfig: 'tsconfig.json',
        bundle: true
    })
})

fs.copyFileSync('./chrome/manifests/manifest.json', './dist_crx/manifest.json')

function listAllFiles(dir) {
    return fs.readdirSync(dir).reduce((files, file) => {
        const name = dir + '/' + file
        const isDirectory = fs.statSync(name).isDirectory()
        return isDirectory ? [...files, ...listAllFiles(name)] : [...files, name]
    }, [])
}

let imgFiles = listAllFiles('./chrome/icons')
let cert = listAllFiles('./chrome/cert')

imgFiles.forEach(file => {
    fs.copyFileSync(file, `./dist_crx/${file.split('/')[3]}`)
})

cert.forEach(file => {
    let name = file.split('/')[3]
    if (name != '.keep') {
        fs.copyFileSync(file, `./dist/${name}`)
    }
})