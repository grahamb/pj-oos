var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var refills = require('node-refills').includePaths;
var livereload = require('gulp-livereload');

gulp.task('styles', function () {
    return gulp.src('./public/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
             includePaths: ['styles'].concat(refills),
             errLogToConsole: true,
             sourceComments: false
         }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./public/sass/**/*.scss', ['styles']);
    gulp.watch(['./views/**/*.hbs']).on('change', function(file) {
        livereload.changed(file);
    });
});

gulp.task('default',function(){
    gulp.start('styles');
});
