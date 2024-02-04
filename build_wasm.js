import cp from "child_process"
import fs from "fs"

const __command_build = "wasm-pack build --target web"
// const __command_build = "wasm-pack build --target bundler"

cp.execSync(__command_build, { cwd: "./markdown-reader", shell: "powershell" }, function (err, stdout, stderr) {
    console.log(err)
    console.log(stdout)
    console.log(stderr)
})

const __dir_prebuild = "./prebuild"

if (fs.existsSync(__dir_prebuild)) {
    fs.rmSync(__dir_prebuild, { recursive: true })
}

fs.mkdirSync(__dir_prebuild)

const dir_wasm_pack = "./markdown-reader/pkg"
const dir_wasm_prebuild = "./prebuild"

fs.cpSync(dir_wasm_pack, `${dir_wasm_prebuild}/pkg`, { recursive: true })
