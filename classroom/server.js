const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;

    req.session.name = name;

    if (name === "anonymous") {
        req.flash("error", "User not registered");
    } else {
        req.flash("success", "User registered successfully!");
    }

    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
   
    res.render("page.ejs", {
        name: req.session.name,
    });
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});