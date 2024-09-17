const express = require("express");
const { registerUser, loginUser, currentUser, updateProfile } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router()

router.post("/register", registerUser )
router.post("/login", loginUser)
router.get("/profile", validateToken, currentUser)
router.put("/updateProfile", validateToken, updateProfile)


module.exports = router;