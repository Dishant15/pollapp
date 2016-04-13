var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var routes = require('./views/index');
var users = require('./views/users');
var polls = require('./views/polls');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

// setup database connection
var mongo_uri = "mongodb://dishant:root@ds023490.mlab.com:23490/heroku_z2bxm2mx";
mongoose.connect(mongo_uri, function(err, db){
  if(err){
    console.log(err);
    process.exit(1);
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
          secret: '634HKG235H35hk2345Hk',
          saveUninitialized: true,
          resave: true
        }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// custom middleware function to handle user logins and anom. sessions
app.use(function(req, res, next){
  var new_session = {
    id:"none",
    polls:[]
  };
  req.session.user = req.session.user || new_session;
  req.session.logged = req.session.logged || false;
  next();
});

app.use('/', routes);
app.use('/user', users);
app.use('/poll', polls);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
