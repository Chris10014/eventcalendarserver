require("dotenv").config(); // this loads env vars

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var passport = require("passport");
var authenticate = require("./authenticate");
var config = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const uploadRouter = require("./routes/uploadRouter");

var sportEventRouter = require("./routes/sportEventRouter");
var raceRouter = require("./routes/raceRouter");
var sportRouter = require("./routes/sportRouter");
var countryRouter = require("./routes/countryRouter");
var teamRouter = require("./routes/teamRouter");
var dateRouter = require("./routes/dateRouter");
var participantRouter = require("./routes/participantRouter");
var emailValidationRouter =  require("./routes/emailValidationRouter");
var raceRegistrationRouter = require("./routes/raceRegistrationRouter");
var sendMailRouter = require("./routes/sendMailRouter");

const mongoose = require("mongoose");

// const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

var app = express();

// Secure traffic only
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("12345-67890-09876-54321")); //Secret to sign the cookie
app.use(
  session({
    name: "session-id",
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error("Authentication failed!");
//     err.status = 403;
//     next(err);
//   } else {
//     next();
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/imageUpload", uploadRouter);

app.use("/sportEvents", sportEventRouter);
app.use("/sports", sportRouter);
app.use("/countries", countryRouter);
app.use("/teams", teamRouter);
app.use("/dates", dateRouter);
app.use("/races", raceRouter);
app.use("/participants", participantRouter);
app.use("/emailValidations", emailValidationRouter);
app.use("/raceRegistrations", raceRegistrationRouter);
app.use("/sendMails", sendMailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("Err: ", err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message});
  res.render("error");
});

module.exports = app;
