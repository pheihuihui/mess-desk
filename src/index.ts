import { createRoot } from "react-dom/client"
import { _app } from "./pages/_app"
import { initDB } from "./utilities/db"
import { DB_CONFIG } from "./utilities/constants"

let div = document.getElementById("rootdiv") as HTMLDivElement

initDB(DB_CONFIG)

const root = createRoot(div)
root.render(_app)
