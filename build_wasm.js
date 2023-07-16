const path = require('path')
const cp = require('child_process')
const fs = require('fs')

const __path_comrak = path.join(__dirname, "./wasm/comrak")
const __path_comrak_exe = path.join(__path_comrak, "./target/wasm32-unknown-unknown/release/comrak.wasm")
const __path_resources_exe = path.join(__dirname, "./resources/comrak.wasm")

const __command_build = 'cargo build --verbose --target wasm32-unknown-unknown --release'

cp.exec(__command_build, { cwd: __path_comrak, shell: 'powershell' }, function (err, stdout, stderr) {
    console.log(err)
    console.log(stdout)
    console.log(stderr)
    fs.cp(__path_comrak_exe, __path_resources_exe, err => {
        if (err) {
            console.log(err)
        } else {
            console.log("copied")
        }
    })
});