const { Router } = require("express")
const { register, login, logOut, profile } = require("../controllers/users.controller")
const { authMiddleware } = require("../utils/authMiddleware")
const router = Router()

// router.route("/router/testing").get()
router.get("/testing", (req, res) => {
    res.status(200).send({ status: false, message: "testing" })
})

router.route("/register").post(register)

router.route("/login").post(login)
router.route("/logout").put(authMiddleware, logOut)
router.route("/profile").get(authMiddleware, profile)
module.exports = router