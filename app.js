const express = require("express");
const app = express();
const mongoose = require("mongoose");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local")
const session = require('express-session')
const User = require("./models/user.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/form";
main()
    .then(() => {
        console.log("start is DB")
    }).catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
const userRouter = require("./routes/user.js");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));


const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

app.use("/", userRouter)

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});