const express = require("express");
const { register, login, lecturerRegister, updateProfile } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/lecturerReg", lecturerRegister);
router.put("/profile/:userId", verifyToken, updateProfile);

module.exports = router;
