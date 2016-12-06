var cors = require('cors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer  = require('multer');
var pug = require('pug');

var intro = require('./routes/intro');
var dashboard = require('./routes/dashboard');
var reports = require('./routes/reports');
var initapps = require('./routes/initApp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', intro);
app.use('/dashboard', dashboard);
app.use('/reports', reports);
app.use('/intro', intro);

// TO-DO Hard Coding 변경 필요
// -5 ~ -1일 Raw Data를 서비스 시작시 Loading 한다.
global._rawDataByDay = {};
initapps({id:'20161205', val:1});
initapps({id:'20161204', val:2});
initapps({id:'20161203', val:3});
initapps({id:'20161202', val:4});
initapps({id:'20161201', val:5});
// initapps('20161202');
// initapps('20161203');

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
