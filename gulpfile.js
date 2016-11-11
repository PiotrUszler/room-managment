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
    sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function () {
    gulp.src(['angularjs/controllers/module.js', 'angularjs/controllers/config.js', 'angularjs/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets'))
});

gulp.task('dev', ['js'], function () {
    gulp.watch('angularjs/**/*.js', ['js'])
});