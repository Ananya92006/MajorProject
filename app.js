// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport=require("passport");
// const LocalStrategy=require("passport-local");
// const User=require("./models/user.js");
// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");
// const ExpressError = require("./utils/expressError.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// // Database connection
// async function main() {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to DB");
// }
// main().catch(err => console.error("Error connecting to DB:", err));

// // App setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));

// // Session setup
// const sessionOptions = {

//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     },
// };
// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// // Middleware to make flash messages available in all views
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });
// app.get("/demouser",async(req,res)=>{
// let fakeUser=new User({
//     email:"student@gmail.com",
// username:"delta-student",
// });
// let registeredUser=await User.register(fakeUser,"helloworld");
// res.send(registeredUser);

// User.register(fakeUser,"helloworld");
// })
// // Routes
// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);

// // Root route
// app.get("/", (req, res) => res.send("I am root"));

// // 404 handler
// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page Not Found!", 404));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Something went wrong!";
//     res.status(statusCode).render("error", { err });
// });

// app.listen(8000, () => console.log("Server is listening on port 8000"));

// if(!process.env.NODE_ENV !="production"){
// require('dotenv').config();}

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const session = require("express-session");
// const MongoStore=require("connect-mongo");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter=require("./routes/user.js");
// const ExpressError = require("./utils/expressError.js");
// const {isLoggedIn}=require("./middleware.js");
// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// const dbUrl=process.env.ATLASDB_URL;

// // Database connection
// async function main() {
//     await mongoose.connect(dbUrl);
//     console.log("Connected to DB");
// }
// main().catch(err => console.error("Error connecting to DB:", err));

// // App setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));

// // Session setup
// const sessionOptions = {
//     store,  // ✅ Now store is already defined
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     },
// };

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
// secret:"mysupersecretcode"
//     },
//     touchAfter:24*3600,
// });
// store.on("error",()=>{
//     console.log("Error in mongoSession store",err);

// })
// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// // Middleware to make flash messages available in all views
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser=req.user;
    
//     next();
// });

// app.get("/demouser", async (req, res) => {
//     const fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     try {
//         const existingUser = await User.findOne({ username: fakeUser.username });
//         if (existingUser) {
//             return res.status(400).send("User already exists!");
//         }

//         const registeredUser = await User.register(fakeUser, "helloworld");
//         res.send("User registered successfully: " + registeredUser.username);
//     } catch (error) {
//         if (error.name === "UserExistsError") {
//             return res.status(400).send("A user with this username already exists.");
//         }
//         res.status(500).send("Internal server error");
//     }
// });

// // Routes
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/",userRouter);
// // Root route


// // 404 handler
// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page Not Found!", 404));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Something went wrong!";
//     res.status(statusCode).render("error", { err });
// });

// app.listen(8000, () => console.log("Server is listening on port 8000"));

if (!process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const ExpressError = require("./utils/expressError.js");
const { isLoggedIn } = require("./middleware.js");

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
}
main().catch(err => console.error("Error connecting to DB:", err));

// App setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB Session Store Setup (Define store First)
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("Error in mongoSession store", err);
});

// Session setup (Use store After Initialization)
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async (req, res) => {
    const fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });

    try {
        const existingUser = await User.findOne({ username: fakeUser.username });
        if (existingUser) {
            return res.status(400).send("User already exists!");
        }

        const registeredUser = await User.register(fakeUser, "helloworld");
        res.send("User registered successfully: " + registeredUser.username);
    } catch (error) {
        if (error.name === "UserExistsError") {
            return res.status(400).send("A user with this username already exists.");
        }
        res.status(500).send("Internal server error");
    }
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(8000, () => console.log("Server is listening on port 8000"));
