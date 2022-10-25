const express = require("express");
const passport = require("passport");
const router = express.Router();

//@description auth with google
//@route Get/
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
//@description google auth callback
//@route Get/auth/google/callback/
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//@desc logout user
//@route /auth/logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
