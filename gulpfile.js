var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass  = require('gulp-ruby-sass');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var watch = require('gulp-watch');
var tiny_lr = require('tiny-lr');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var argv = require('yargs').argv;
var PRODUCTION = argv.production;

if (PRODUCTION) {
  webpackConfig.devtool = false;
  webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
}

gulp.task('clean', function() {
  del(['./public/dist/**', './public/css/**'])
});

gulp.task('sass', function() {
  var sassOptions = PRODUCTION ? {} : { sourcemap: true };
  return sass('./public/sass/style.scss', sassOptions)
  .on('error', function (err) {
    console.error('Error!', err.message);
  })
  .pipe(PRODUCTION ? gutil.noop() : sourcemaps.write())
  .pipe(PRODUCTION ? minifyCSS() : gutil.noop())
  .pipe(gulp.dest('./public/css'));
});

gulp.task('webpack', function(callback) {
  execWebpack(webpackConfig);
  callback();
});

gulp.task('dev', ['build'], function() {
  var lr_server = create_lr_server(35729);
  gulp.watch('./public/sass/**/*.scss', function(ev) {
    gulp.run('build');
  });
  gulp.watch('./src/**/*.js', function(ev) {
    gulp.run('build');
  });
  gulp.watch(['./public/dist/**/*', './public/css/**/*', './views/**/*.hbs'], function(ev) {
    lr_server.changed({
      body: {
        files: [ev.path]
      }
    });
  });
});

var build_tasks = ['webpack', 'sass'];
if (PRODUCTION) {
  build_tasks.unshift('clean');
}

gulp.task('build', build_tasks);

gulp.task('default', ['build'], function() {
  setTimeout(function() {
    gutil.log("**********************************************");
    gutil.log("* gulp              (development build)");
    gutil.log("* gulp clean        (rm public/[dist,css])");
    gutil.log("* gulp --production (production build)");
    gutil.log("* gulp dev          (build and run dev server)");
    gutil.log("**********************************************");
  }, 3000)
})

function execWebpack(config) {
  webpack(config, function(err, stats) {
    if (err) { throw new gutil.PluginError('execWebpack', err); }
    gutil.log("[execWebpack]", stats.toString({colors: true}));
  });
}

function create_lr_server(port) {
  var lr = tiny_lr();
  lr.listen(port, function() {
    return gutil.log("LiveReload listening on", port);
  });
  return lr;
}