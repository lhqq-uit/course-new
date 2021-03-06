var express = require("express");
var session = require("express-session");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var cors = require("cors");
var config = require("./config/database");
var flash = require("connect-flash");

var followRedirects = require("follow-redirects");
followRedirects.maxBodyLength = 100 * 1024 * 1024;

mongoose.Promise = global.Promise;

mongoose
  .connect(config.database, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(
    () => console.log("ket noi thanh cong"),
    err => console.log("ket noi that bai")
  );
//app.use("/api/resetPassword", express.static(path.join(__dirname, "public")));
var app = express();
// ! Session
app.use(
  session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 18000000
    } // ! auto delete after 5 hour
  })
);

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(passport.initialize());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.session());

//static file
// app.use("/", express.static(path.join(__dirname, "views")));

var api = require("./api");
app.use("/api", api);

var home = require("./routes");
app.use("/", home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
