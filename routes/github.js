const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", passport.authenticate("github"));
router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

module.exports = router;
