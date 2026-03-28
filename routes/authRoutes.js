const express = require("express");
const router = express.Router();
const { googleLogin, emailSignup, emailLogin } = require("../controllers/authController");

router.post("/google", googleLogin);
router.post("/signup", emailSignup);
router.post("/login", emailLogin);

module.exports = router;