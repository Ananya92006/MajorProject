// const express = require("express");
// const router = express.Router();
// const User = require("../models/user.js");
// const passport = require("passport");
// const wrapAsync = require("../utils/wrapAsync.js");
// const userController=require("../controllers/users.js");
// // Route to render the signup page
// router.get("/signup", userController.rendersignUpForm);

// // Route to handle signup form submission
// router.post("/signup", wrapAsync(userController.signUp)
// );

// // Route to render the login page (pass flash messages)
// router.get("/login", userController.renderLoginForm);

// // Route to handle login form submission
// // router.post("/login", passport.authenticate("local", {
// //     failureRedirect: "/login",
// //     failureFlash: true // Flash message on failure
// // }),
// router.post("/login", passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true 
// }), (req, res) => {
//     req.flash("success", "Welcome back to Wanderlust!"); // Add success flash message
//     let redirectUrl = req.session.redirectUrl || "/listings";
//     delete req.session.redirectUrl;
//     res.redirect(redirectUrl);
// });



// // Route to handle logout
// router.get("/logout",userController.logout);

// module.exports = router;



const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js")
const userController = require('../controllers/users.js')

//Signup routes
router.route('/signup')
    .get((req, res) => {
        res.render("./users/signup.ejs");
    })
    .post(wrapAsync(userController.signup));

//Login routes
router.route('/login')
    .get((req, res) => {
        res.render("./users/login.ejs");
    })
    .post(
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        wrapAsync(userController.login)
    );


//LogOut routes
//Passport has inbuild function for logout
router.get('/logout', userController.logout);

module.exports = router;