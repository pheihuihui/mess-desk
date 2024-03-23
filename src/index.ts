import { createRoot } from "react-dom/client"
import { _app } from "./pages/_app"
import { findOneFile, fromHash, initDB, populateOneFile } from "./utilities/db"

let div = document.getElementById("rootdiv") as HTMLDivElement

const root = createRoot(div)
setTimeout(() => {
    root.render(_app)
}, 500)

window.initDB = initDB
window.debugging = {
    fromHash: fromHash,
}
