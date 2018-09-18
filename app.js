const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const app = express();
const routes = require('./routes/index');
const swagger = require('./routes/swagger');
const Services = require('./services');
const config = require('config');

/**
 * Get port from environment and store in Express.
 */
global.models = require('./models');
global.services = new Services();
global.config = config;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ejs layout
app.use(expressLayouts);
app.use(passport.initialize());
// un-comment after placing your favicon in /public
// app.use(favicon(path.resolve('/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', swagger);
app.use('/api', routes);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// no stack traces leaked to user unless in development environment
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: 'WOOOOOOPS!',
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});

console.info('[!] app running environment:', app.get('env'));

module.exports = app;
