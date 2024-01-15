import express from "express"

const app = express()
app.use("/desq", express.static(`./dist/`))
app.listen(8080)
