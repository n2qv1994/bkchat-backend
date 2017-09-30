var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var cors         = require('cors');
var routes       = require('../routes/index');
var users        = require('../routes/users');
var app          = express();
var api          = require('./api/api.js');

// Run initializers
require('../config/initializers/init_app')();
// require('../config/initializers/init_redis')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../doc_api')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type", "Access-Control-Allow-Headers", "Authorization");
//   if(req.method == 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.all('/api/*', function(req, res, next) {
//   // CORS headers
//   res.header("Access-Control-Allow-Origin", "http://localhost:9000");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method == 'OPTIONS') {
//     res.sendStatus(200);
//     res.end();
//   } else {
//     return next();
//   }
// });
// var corsOptions = {
//   origin: 'localhost:9000'
// };

// app.options('/api/*', cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, room_code");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

// REST API
app.use('/api', api);

// Swagger
var swagger = require('swagger-express');

app.use(swagger.init(app, {
  apiVersion: '1.0',
  swaggerVersion: '1.0',
  swaggerURL: '/swagger',
  swaggerJSON: '/api-docs.json',
  swaggerUI: './doc_api/public/swagger/',
  basePath: 'http://198.23.226.18:3000',
  apis: ['./doc_api/activity.yml','./doc_api/user.yml','./doc_api/authenticate.yml','./doc_api/meeting.yml'],
  middleware: function(req, res){}
}));


// app.use('/', routes);
// app.use('/users', users);

// download && upload
// app.use('/', require('./routes/upload.js'));
// app.use('/', require('./routes/download.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
  return res.status(400).json({message: "Bad request", data: {}, status_code: 400, status: "error"});
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
