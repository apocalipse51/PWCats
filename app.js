var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/js", express.static(path.join(__dirname + '/js')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.configure('production', () => {
  	app.use((req, res, next) => {
	    if (req.header('x-forwarded-proto') !== 'https') {
	      res.redirect(`https://${req.header('host')}${req.url}`);
	    } else {
	      next();
	    }
  	})
});

app.get('/', (req, res, next) => {
    res.render('index');
});

app.use(function(err, req, res, next) {    
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;