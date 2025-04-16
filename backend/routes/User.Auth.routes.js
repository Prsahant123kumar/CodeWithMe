const express = require("express");
const { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } = require("../controllers/SignUp");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
module.exports = router;
