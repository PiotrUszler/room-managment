/**
 * Created by Piotr Uszler on 19.09.2016.
 */
/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass');

gulp.task('js', function () {
    gulp.src(['angularjs/controllers/module.js', 'angularjs/controllers/config.js', 'angularjs/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets'))
});

gulp.task('css', function () {
    gulp.src('css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('assets'))
});

gulp.task('dev', ['js', 'css'], function () {
    gulp.watch('angularjs/**/*.js', ['js']);
    gulp.watch('css/**/*.scss', ['css']);
});