var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('ziuq'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    var now = new Date();
    var lastreq = req.session.lastreq ? new Date(req.session.lastreq) : new Date();
    
    // se guarda path actual para redirigir después de login o logout
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    
        if ((now.getTime() - 120000) > lastreq.getTime()) { // milisegundos            
            var errors = [{"message": '-> Sesión caducada'}];            
            res.locals.session = req.session;         
            res.render('sessions/new', { errors: errors });            
        } else {            
            req.session.lastreq = new Date();  
            res.locals.session = req.session;
            next();   
      }
    } else {                
        req.session.lastreq = new Date();  
        res.locals.session = req.session;
        next();   
    }
});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
