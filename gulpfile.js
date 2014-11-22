var gulp = require('gulp')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var reactify = require('reactify')
var notify = require('gulp-notify')
var watchify = require('watchify')
var uglify = require('gulp-uglify')
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')

// see https://gist.github.com/Sigmus/9253068
function handleErrors() {
  var args = Array.prototype.slice.call(arguments)

  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
    sound: 'Glass'
  }).apply(this, args)

  this.emit('end')
}

function buildScript(isWatch) {
  var b = browserify('./dev/js/main.js', watchify.args)

  var rebundle = function() {
    return b.bundle()
      .on('error', handleErrors)
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(gulp.dest('./public/js'))
  }

  b.transform(reactify)

  if (isWatch) b = watchify(b).on('update', rebundle)

  return rebundle()
}

gulp.task('browserify-watch', function(){
  return buildScript(true)
})

gulp.task('build', [], function() {
  return buildScript(false)
})

gulp.task('css', function() {
  gulp.src('./dev/css/*.css')
    .pipe(minifyCSS())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'))
});

gulp.task('watch', [], function() {
  gulp.watch('./dev/*.jsx', ['browserify-watch'])
})

gulp.task('default', [])
