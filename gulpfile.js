var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var livereload = require('gulp-livereload');


gulp.task('sass', function() {
    return gulp.src('./public/sass/style.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: '../sass'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
})

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
