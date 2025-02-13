const jwt = require('jsonwebtoken');
const registerModel = require("../models/register.model")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.authToken
        if (!token) {
            return res.status(404).send({ status: false, message: `user not exist` })
        }
        const decoded = jwt.verify(token, 'CodeForMe');
        const userExsit = await registerModel.findById(decoded.userId)
        if (!userExsit || userExsit.sessionToken !== token) {
            return res.status(401).send({ status: false, message: `session expired. please login again` })
        }
        req.userId = decoded.userId
        next()
    } catch (error) {
        // console.log(error)
        return res.status(401).send({ status: false, message: `unauthorized` })
    }
}
module.exports = { authMiddleware }