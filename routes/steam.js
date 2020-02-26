const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("steam", { failureRedirect: "/users/login" })
);

router.get(
  "/return",
  passport.authenticate("steam", { failureRedirect: "/users/login" }),
  function(req, res) {
    res.redirect("/account");
  }
);

module.exports = router;
