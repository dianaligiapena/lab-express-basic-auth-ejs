const express = require('express');
const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  if (!req.session.user) {
    res.redirect("/auth/login");
  }

  res.render("profile", { user: req.session.user });
});

module.exports = router;
