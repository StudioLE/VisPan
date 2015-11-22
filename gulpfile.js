// Core modules
var p = require('path')
var ver = require('./package.json').version

// Node modules
var gulp = require('gulp')
var gp_bump = require('gulp-bump')
var gp_clean = require('gulp-clean')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var gp_minify = require('gulp-minify-css')

var build = {
  /**
   * Format build directory path
   */
  path: function(path) {
    if( ! path) path = ''
    return p.join('dist', path)
  }
}

// Bump version
gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(gp_bump({
    // type:'prerelease'
  }))
  .pipe(gulp.dest('./'))
})

// Clean build directory
 gulp.task('clean', function () {
  return gulp.src(build.path(), {
    // read: false
  })
  .pipe(gp_clean())
})

// Build app CSS
gulp.task('css', function() {
  gulp.src('src/vispan.css')
  .pipe(gulp.dest(build.path('css')))
  .pipe(gp_rename('vispan.min.css'))
  .pipe(gp_minify({keepSpecialComments: 0}))
  .pipe(gulp.dest(build.path('css')))
})

// Build app JS
gulp.task('js', function() {
  gulp.src('src/vispan.js')
  .pipe(gulp.dest(build.path('js')))
  .pipe(gp_rename('vispan.min.js'))
  .pipe(gp_uglify())
  .pipe(gulp.dest(build.path('js')))
})

// Build task
gulp.task('build', ['css', 'js'])

// Default task
gulp.task('default', ['build'])
