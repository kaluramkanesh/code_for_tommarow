const registerModel = require("../models/register.model")
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require("bcrypt")
function generateToken(userId) {
    const result = jwt.sign({ userId }, 'CodeForMe', { expiresIn: '1h' });
    return result
}
const register = async (req, res) => {
    try {
        const data = req.body
        const validation = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(3).max(30),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        })
        const { error } = validation.validate(data)
        if (error) {
            return res.status(400).send({ status: false, message: error.details[0].message })
        }
        const { username, email, password } = data
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        data.password = hashedPassword
        const register = await registerModel.create(data)
        return res.status(201).send({ status: true, message: `user register successfully` })
    } catch (error) {
        return res.status(500).send({ status: false, message: `internal server error ${error.message}` })
    }
}

const login = async (req, res) => {
    try {
        const data = req.body
        const validation = Joi.object({
            password: Joi.string().min(3).max(30),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        })
        const { error } = validation.validate(data)
        if (error) {
            return res.status(400).send({ status: false, message: error.details[0].message })
        }
        const { email, password } = data

        const userExist = await registerModel.findOne({ email: email })
        if (!userExist) {
            return res.status(404).send({ status: false, message: `user not exist` })
        }
        const isValidPassword = await bcrypt.compare(password, userExist.password)
        if (!isValidPassword) {
            return res.status(404).send({ status: false, message: `invalid credentials` })
        }
        userExist.sessionToken = null
        await userExist.save()
        const token = generateToken(userExist._id)
        userExist.sessionToken = token
        await userExist.save()
        res.cookie("authToken", token, {
            httpOnly: true, secure: true
        })
        return res.status(200).send({ status: true, message: "login success", token: token })
        // sessionToken
    } catch (error) {
        return res.status(500).send({ status: false, message: `internal server error ${error.message}` })
    }
}

const logOut = async (req, res) => {
    try {
        const userId = req.userId
        const user = await registerModel.findByIdAndUpdate(userId, { $set: { sessionToken: null } })
        res.clearCookie("authToken")
        return res.status(200).send({ status: true, message: `user log out successfully` })
    } catch (error) {
        return res.status(500).send({ status: false, message: `internal server error ${error.message}` })
    }
}

const profile = async (req, res) => {
    try {
        const userId = req.userId
        const user = await registerModel.findById(userId)
        return res.status(200).send({ status: true, message: `user get successfully`, data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: `internal server error ${error.message}` })
    }
}
module.exports = { register, login, logOut, profile }