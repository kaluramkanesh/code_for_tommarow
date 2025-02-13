const { Server } = require("socket.io")
const registerModel = require("../models/register.model")
const messageModel = require("../models/message.models")
const jwt = require('jsonwebtoken');
function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
            credentials: true
        }
    })
    io.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, 'CodeForMe', function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        }
        else {
            next(new Error('Authentication error'));
        }
    })

    io.on("connection", (socket) => {
        // console.log(socket.handshake.query.groupId)
        socket.join(socket.handshake.query.groupId);

        socket.on("connected", async () => {
            socket.emit("connected-success", 'Hi')
        })

        socket.on("message_send", async (data) => {
            // socket.emit("message_recieve", data)
            io.to(socket.handshake.query.groupId).emit("message_recieve", data);
            const message = await messageModel.create(socket.decoded.userId, { $set: { senderId: socket.decoded.userId, message: data.message } }, { upsert: true }, { new: true })
        })
    })

}
module.exports = { initializeSocket }