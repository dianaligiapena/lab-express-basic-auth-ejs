const express = require('express');
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', async (req, res) => {
    const body = {...req.body};

    if (body.password.length < 6) {
        res.render('auth/signup', { errorMessage: 
            "Password must be at least 6 characters long", body: req.body });
    }
    else {
        const salt = await bcrypt.genSalt(13);
        const passwordHash = bcrypt.hashSync(body.password, salt);

        delete body.password;
        body.passwordHash = passwordHash;

        console.log(body);

        try {
            let newUser = await User.create(body);
            req.session.user = newUser;
            res.send(body);
            res.redirect('/profile');
        }
        catch (error) {
            if (error.code === 11000) {
                console.log('Duplicate');
                res.render('auth/signup', { 
                    errorMessage: "User already exists", 
                    userData: req.body,
                 });
            } 
            else {
                res.render('auth/signup', { 
                    errorMessage: "Something went wrong", 
                    userData: req.body,
                 });
            }
          
        }
    }

});

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', async (req, res) => {
    console.log('SESSION =====> ', req.session); /////////////// console log  session

    const body = {...req.body};

    const userMatch = await User.find({username: body.username}); // find -> array
    console.log(userMatch);
    console.log("it s a match")

    if (userMatch.length) {   // find has an element (match)
        // user found
        const user = userMatch[0];

        if (bcrypt.compareSync(body.password, user.passwordHash)) { // return a boolean
            // correct password
            console.log("correct password");

            const tempUser = {};
            tempUser.username = user.username;
            delete tempUser.passwordHash;

            req.session.user = tempUser; ////////////////// really important line
            res.redirect('/profile');
            
        } else {
            // incorrect password
            console.log("incorrect password");
            res.render('auth/login', { 
                errorMessage: "Incorrect password", 
                userData: req.body,
             });
        }
    } else { 
        // user not found
        console.log("user not found");
        res.render('auth/login', { 
            errorMessage: "User not found", 
            userData: req.body,
         });

    }

});



module.exports = router;
