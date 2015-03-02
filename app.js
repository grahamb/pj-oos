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
var multer  = require('multer');
var uaCompatible = require('ua-compatible')
var exphbs = require('express-handlebars');
var routes = {};
var routeFiles = fs.readdirSync('./routes');
var passwordless = require('passwordless');
var PasswordlessRedisStore = require('passwordless-redisstore');
var role = require('connect-acl')(require('./lib/roles'));

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
  helpers: require('./lib/helpers')
}));
app.set('view engine', 'hbs');

app.use(uaCompatible);
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  store: new ConnectRedisStore({ host: config.get('sessions.redis.host'), port: config.get('sessions.redis.port'), ttl: 2592000 }),
  secret: config.get('sessions.secret'),
  cookie: { maxAge: 2592000000 }
}));
app.use(flash());
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ enableOriginRedirect: true, successRedirect: '/'}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
  dest: './tmp/imports'
}));

// add the env to locals
app.use(function(req, res, next) {
  res.locals.production = 'production' === app.get('env');
  next();
});

// add the user id to every request
app.use(function(req, res, next){
  var roles = require('./lib/roles');
  if (req.user) {
    var models = require('./models');
    models.Login.find(req.user).then(function(login) {
      login = login.dataValues;
      login.roles = roles[login.role].can;
      req.session.user = login;
      res.locals.user = req.user;
      next();
    });
  } else {
    req.session.user = {
      role: 'anonymous',
      roles: roles['anonymous'].can
    };
    next();
  }
});

app.use(role.middleware());

app.use('/', routes.index);

app.use('/oos',
  passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }),
  role.can('view oos'),
  routes.oos
  );

app.use('/programs', routes.programs);

app.use('/program_guide', routes.program_guide);

app.use('/program_selection', passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }), routes.program_selection);

app.use('/units', passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }), routes.units);

app.use('/admin',
  passwordless.restricted({ failureRedirect: '/login', originField: 'origin' }),
  role.isAny(['admin']),
  routes.admin
  );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render(404);
  } else {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});


module.exports = app;
