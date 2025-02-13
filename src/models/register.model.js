const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    sessionToken: {
        type: String
    }
}, { timestamps: true })
module.exports = mongoose.model("abcUser", schema)