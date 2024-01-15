import path from "path"
import cp from "child_process"

const __path_comrak = path.join(__dirname, "./wasm/comrak")

const __command_build = "wasm-pack build --target web"

cp.exec(__command_build, { cwd: __path_comrak, shell: "powershell" }, function (err, stdout, stderr) {
    console.log(err)
    console.log(stdout)
    console.log(stderr)
})
