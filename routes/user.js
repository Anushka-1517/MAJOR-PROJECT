const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
// Render Signup Page
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// Register New User
router.post("/signup", wrapAsync(async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
        });

        await User.register(newUser, password);

        req.flash("success", "Welcome to WanderLust! Your account has been created successfully.");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res) =>{
    res.render("users/login.ejs");
});
router.post("/login",passport.authenticate("local" , {
    failureRedirect:"/login",
    failureFlash: true,
}),
    async(req,res) =>{
req.flash("success", "Welcome back to Wanderlust!");
res.redirect("/listings");
}
);
module.exports = router;