const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", { user: req.user })
);

router.get("/account", ensureAuthenticated, function(req, res) {
  res.render("account", { user: req.user });
});

module.exports = router;
