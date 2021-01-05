const express = require("express");

const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  socialLogin,
} = require("../controllers/auth");
const { findUser } = require("../controllers/user");

const { userSignupValidator, passwordResetValidator } = require("../validator");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.post("/social-login", socialLogin);

router.param("userId", findUser);

module.exports = router;
