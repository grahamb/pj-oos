var config = require('config');
var express = require('express');
var app = express();
var session = require('express-session');
var ConnectRedisStore = require('connect-redis')(session);
var flash = require('connect-flash');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var routes = {};
var routeFiles = fs.readdirSync('./routes');
var passwordless = require('passwordless');
var PasswordlessRedisStore = require('passwordless-redisstore');

passwordless.init(new PasswordlessRedisStore(config.get('passwordless.redis.port'), config.get('passwordless.redis.host')));
passwordless.addDelivery(require('./lib/passwordless/sendgridDelivery'));

routeFiles.forEach(function(route) {
    routes[path.basename(route, '.js')] = require('./routes/' + route);
});

app.use(favicon(path.join(__dirname,'public', 'favicon.ico')));

// view engine setup
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: 'views/partials',
    helpers: {
        selected: function(option, value) {

            return option === value ? 'selected' : '';
        },
        whatis: function(value) {
            console.dir(value);
        },
        starred_activity: function(program) {
            console.log(program.premium_activity);
            var html = '<i class="fa fa-star"></i>';
            return program.premium_activity === true ? html : '';
        },
        list_or_none: function(context) {
            var arr = [];
            context = context || [];
            context.forEach(function(item) {
                arr.push('<li>' + item + '</li>');
            });
            return arr.length ? arr.join('') : '<li>None</li>';
        }
    }
}));
app.set('view engine', 'hbs');


app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    store: new ConnectRedisStore({ host: config.get('sessions.redis.host'), port: config.get('sessions.redis.port') }),
    secret: config.get('sessions.secret')
}));
app.use(flash());
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ enableOriginRedirect: true, successRedirect: '/'}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes.index);
app.use('/oos', passwordless.restricted({
    failureRedirect: '/login',
    originField: 'origin'
}), routes.oos);

app.use('/programs', routes.programs);

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
