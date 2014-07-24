'use strict';

var path = require('path');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var mergeStream = require('merge-stream');
var stylish = require('jshint-stylish');

var pkg = require('./package.json');

gulp.task('lint', function() {
  gulp.src(['{,test/}*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
  gulp.src(['package.json'])
    .pipe($.jsonlint())
    .pipe($.jshint.reporter());
});

gulp.task('clean', del.bind(null, ['{build,tmp}']));

gulp.task('build', ['lint', 'clean'], function() {
  return mergeStream(
    gulp.src(['index.js'])
      .pipe($.esnext())
      .pipe($.rename(pkg.main))
      .pipe(gulp.dest('')),
    gulp.src(['test/*.js'])
      .pipe($.esnext())
      .pipe($.rename({suffix: '-es5'}))
      .pipe(gulp.dest('tmp')),
    gulp.src(['cli.js'])
      .pipe($.template({
        main: './' + path.relative('build', pkg.main)
      }))
      .pipe($.rename(pkg.bin))
      .pipe(gulp.dest(''))
  );
});

gulp.task('watch', function() {
  gulp.watch(['*.js', 'test/**/*', 'package.json'], ['test']);
  gulp.watch(['gulpfile.js', '.jshintrc'], ['lint']);
});

gulp.task('test', ['build'], function() {
  gulp.src(['tmp/*.js'], {read: false})
    .pipe($.mocha({reporter: 'spec'}));
});

gulp.task('default', ['test', 'watch']);
