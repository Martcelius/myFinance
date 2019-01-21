var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var pendapatanRouter = require('./routes/pendapatan');
var anggaranRouter = require('./routes/anggaran');
var investasiRouter = require('./routes/investasi');

var app = express();

//mongodb
mongoose.connect("mongodb://localhost:27017/myFinance", {
  useNewUrlParser: true
});

//set passport

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({
  extname: '.hbs',
  defaultLayout: 'layout'
}));
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//variable localy for checking user login or not
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/pendapatan', pendapatanRouter);
app.use('/anggaran', anggaranRouter);
app.use('/investasi', investasiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;