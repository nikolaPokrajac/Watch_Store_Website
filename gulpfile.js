// Gulp loader
const { src, dest, task, watch, series, parallel } = require('gulp');

// --------------------------------------------
// Dependencies
// --------------------------------------------

let gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  changed = require('gulp-changed'),
  uglify = require('gulp-uglify'),
  lineec = require('gulp-line-ending-corrector'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber');

// Project Variables

let styleSrc = './src/sass/**/*.scss';
let styleDest = './dist/css/';

let scriptSrc = './src/js/*.js';
let scriptDest = './dist/js/';
let vendorSrc = './src/js/vendors/*.js';
let vendorDest = './dist/js/';

// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------

// Compiles SASS files
function style() {
  return gulp
    .src(styleSrc)
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(
      rename({
        basename: 'style',
        suffix: '.min'
      })
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(dest(styleDest));
}

// Uglify js files
function js() {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber())
    .pipe(concat('app.min.js'))
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              modules: false
            }
          ]
        ]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(scriptDest));
}

//Concat and Compress Vendor .js files
function vendor() {
  return gulp
    .src('./src/js/vendors/*.js')
    .pipe(concat('vendors.js'))
    .pipe(
      babel({
        presets: [
          [
            '@babel/env',
            {
              modules: false
            }
          ]
        ]
      })
    )
    .pipe(uglify())
    .pipe(dest(vendorDest));
}

// Images
function img() {
  return gulp
    .src('./src/img/*')
    .pipe(changed('./dist/img'))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest('./dist/img'));
}

// Watch for changes
function watcher() {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    notify: false
  });

  watch(styleSrc, series(style));
  watch(scriptSrc, series(js));
  watch(vendorSrc, series(vendor));
  watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js']).on('change', reload);
}

// Use default task to launch Browsersync and watch files
let build = parallel(watcher);
task('default', build);
task('img', img);

exports.style = style;
exports.js = js;
exports.vendor = vendor;
exports.watcher = watcher;
exports.img = img;
