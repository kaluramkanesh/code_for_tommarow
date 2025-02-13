const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const schema = new mongoose.Schema({
    senderId: {
        type: ObjectId,
        ref: 'abcUser'
    },
    message: {
        type: String,
        trim: true
    }
}, { timestamps: true })
module.exports = mongoose.model("user_chats", schema)