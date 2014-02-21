var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['lib/*.js', 'test/**/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
  return gulp.src('lib/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('test', ['cover'], function () {
  return gulp.src(['test/unit/*.js', 'test/unit/integration/*.js'])
    .pipe(plugins.mocha())
    .pipe(plugins.istanbul.writeReports());
});