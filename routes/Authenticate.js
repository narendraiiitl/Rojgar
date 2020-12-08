const express = require("express");
const router = express.Router();
const passport = require("passport");
const authcontroller = require("../controllers/auth.controller");
router.post("/register", authcontroller.register);
router.post("/frontendgoogleregister", authcontroller.frontendgoogleregister);

router.post("/login", passport.authenticate(["google"]), authcontroller.login);

router.post("/refresh-token", authcontroller.refreshToken);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  authcontroller.googleLogin
);

router.delete("/logout", authcontroller.logout);

module.exports = router;
