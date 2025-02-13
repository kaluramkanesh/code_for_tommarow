const express = require("express")
const mongoose = require("mongoose")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const router = require("./routers/routes")
const PORT = 3000
app.use(express.json({ limit: '16MB', extended: true }))
app.use(helmet())
app.use(cors({ credentials: true }))
app.use(cookieParser())
mongoose.connect("mongodb+srv://thinkinternet2020:FlrUonevplMlfTXx@cluster0.bgydh5k.mongodb.net/ludobattle", {
})

const { initializeSocket } = require("./controllers/socket.controller")
const http = require("http")
const server = http.createServer(app)
const io = initializeSocket(server)
app.set("io", io)
app.use("/", router)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})