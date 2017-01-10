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

var config = require('./config/config.json');
console.log('config : %j', config);
global.config = config;

var intro = require('./routes/intro');
var login = require('./routes/nodeLogin');
var dashboard = require('./routes/nodeDashboard');
var reports = require('./routes/nodeReports');
var initapps = require('./routes/initApp');
var socketapps = require('./routes/socketApp');

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

// app.use('/', intro);
app.use('/', login);
app.use('/dashboard', dashboard);
app.use('/reports', reports);
app.use('/intro', intro);


// 지정된 기간의 Raw Data를 서버 시작시 메모리에 Loading
global._rawDataByDay = {};
if (config.loaddataonstartup.active === true)
  initapps.loadData(function(in_params) {});

// Client로 Data를 Push 하기위한 Socket 초기화.
socketapps.initSocket(app, function() {});

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
