const express = require("express");
const { register, login,lecturerRegister} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/lecturerReg",lecturerRegister)

module.exports = router;
