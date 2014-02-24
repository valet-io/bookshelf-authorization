var gulp    = require('gulp');
var gutil   = require('gulp-util');
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
  require('mocha-as-promised')();
  require('chai').use(require('chai-as-promised'));
  return gulp.src(['test/unit/*.js', 'test/unit/integration/*.js'])
    .pipe(plugins.mocha())
    .on('error', function (err) {
      gutil.log(err.toString())
      if (watch) {
        this.emit('end');
      } else {
        process.exit(1);
      }
    })
    .pipe(plugins.istanbul.writeReports());
});

var watch;
gulp.task('watch', function () {
  watch = true;
  gulp.watch(['test/**', 'lib/**'], ['test']);
});