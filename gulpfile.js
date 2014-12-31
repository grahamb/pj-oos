var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var refills = require('node-refills').includePaths;

var paths = {
    scss: './public/sass/*.scss'
};

gulp.task('styles', function () {
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(watch(paths.scss))
         .pipe(sass({
             includePaths: ['styles'].concat(refills),
             errLogToConsole: true
         }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default',function(){
    gulp.start('styles');
});
