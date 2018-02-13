var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyjs = require('gulp-minify');
var order = require('gulp-order');
var del = require('del');

gulp.task('js', function(type) {
    return gulp.src(['src/**/*.js']) // 注意合并顺序，先要合并functions里的函数
        .pipe(order([
            'src/functions/*.js',
            'src/*.js'
        ]))
        .pipe(concat('xo-utils.js'))
        .pipe(minifyjs({
            ext: {
                src: '.js',
                min: '.min.js'
            },
            noSource: false,
            mangle: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    del(['dist'], function(paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    })
});

gulp.task('default', function() {
    gulp.run(['clean', 'js']);
});