'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

// Styles
gulp.task('styles', function () {
  return gulp.src('sass/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('htmls', function () {
    return gulp.src(['views/**/*.*', '!views/**/_*.*'], { base: 'views' })
        .pipe($.plumber())
        .pipe($.twig({
            data: {},
            onError: $.notify.onError(function (error) {
                console.log(error);
                return 'Twig Compile Error: ' + error;
            })
        }))
        .pipe(gulp.dest('public/'));
});

// copy
gulp.task('copy', function () {
    return gulp.src('images/**/*.*')
        .pipe(gulp.dest('public/images'));
});


// Clean
gulp.task('clean', function(cb) {
    del(['public/css/**/*.css', 'public/**/*.html'], cb);
});

// Start Web server
gulp.task('serve', function () {
    return gulp.src('public')
        .pipe($.webserver({
            livereload: true,
            directoryListing: {
                enable: true,
                path: 'public',
                options: {
                    view: 'details',
                    icons: true
                }
            },
            open: true,
            host: '0.0.0.0',
            port: 9999
        }));
});

// Watch
gulp.task('watch', ['copy', 'styles', 'htmls'], function() {
    gulp.start('serve');

    $.watch('images/**/*.*', function () {
        gulp.start('copy');
    });

    $.watch('sass/**/*.scss', function () {
        gulp.start('styles');
    });

    $.watch('views/**/**', function () {
        gulp.start('htmls');
    });
});

// Default
gulp.task('default', ['clean'], function() {
    gulp.start('watch');
});