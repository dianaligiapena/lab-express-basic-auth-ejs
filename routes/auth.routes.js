const express = require('express');
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', async (req, res) => {
    const body = {...req.body};
    const salt = await bcrypt.genSalt(13);
    const passwordHash = await bcrypt.hashSync(body.password, salt);
    delete body.password;
    body.passwordHash = passwordHash;
    try {
        await User.create(body);
        res.send(body);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;
