var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    return sass('./public/sass/style.scss', { sourcemap: true })
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./public/sass/**/*.scss', ['sass']);
    gulp.watch(['./views/**/*.hbs']).on('change', function(file) {
        livereload.changed(file);
    });
});

gulp.task('default',function(){
    gulp.start('sass');
});
