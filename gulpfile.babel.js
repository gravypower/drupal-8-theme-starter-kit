'use strict';

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';
import sprity from 'sprity';

import rename from 'gulp-rename';
import newer from 'gulp-newer';
import gutil from 'gulp-util';

import svgSprite from 'gulp-svg-sprite';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var siteName = 'drupal-8.x-dev'; 

var staticBuild = './static/';
var drupal ='./drupal/'; 
var www = '/var/www/' + siteName + '/';
var themes = www + 'themes/';


const appConfig = {
  staticBuild: staticBuild,
  tmp: '.tmp/',
  drupal: drupal,
  www: www,
  themes: themes,
  theme: themes + siteName + '_theme/',
  twig: staticBuild + 'twig/'
  };



var watches = require('./gulp_libs/watch_tasks.bable.js');
watches.setup(gulp, appConfig);

var twig = require('./gulp_libs/twig_tasks.bable.js');
twig.setup(gulp, appConfig);

var copy = require('./gulp_libs/copy_tasks.bable.js');
copy.setup(gulp, appConfig);

//------------------tasks----------------------------//
gulp.task('test', ['clean'], cb =>
  runSequence(
    ['svg-sprites', 'styles'],
    cb
  ));

gulp.task('default', ['clean'], cb =>
  runSequence(
    ['sprites', 'svg-sprites', 'styles'],
    ['lint', 'html', 'scripts', 'images','twig','drupal-copy', 'font-copy', 'image-copy'],
    cb
  ));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'sprites', 'svg-sprites', 'styles','twig', 'drupal-copy', 'font-copy', 'image-copy', 'template-copy', 'drupal-watch', 'font-watch', 'image-watch', 'template-watch'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: [appConfig.tmp, appConfig.staticBuild],
    port: 3000,
    open: false
  });

  gulp.watch(appConfig.staticBuild + '**/*.html', reload);
  gulp.watch(appConfig.staticBuild + 'styles/**/*.{scss,css}', ['styles', reload]);
  gulp.watch(appConfig.staticBuild + 'scripts/**/*.js', ['scripts']);
  gulp.watch(appConfig.staticBuild + 'images/**/*', reload);
  gulp.watch(appConfig.staticBuild + 'twig/**/*.*', ['twig', reload]);
  gulp.watch(appConfig.staticBuild + 'images/sprites', ['sprites', 'styles'], reload);
  gulp.watch(appConfig.staticBuild + 'images/svg', ['svg-sprites', 'styles'], reload);

});

//----------------------------------------------//





// Clean output directory
gulp.task('clean', cb => del([appConfig.tmp], {dot: true}));




// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(appConfig.staticBuild + 'scripts/**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError())));

// Optimize images
gulp.task('images', () =>
  gulp.src(appConfig.staticBuild + 'images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe($.size({title: 'images'})));

//sprites
gulp.task('sprites', function () {
  return sprity.src({
    src: appConfig.staticBuild + 'images/sprites/*.{png,jpg}',
    style: './sprite.css',
    cssPath: '',
    name: 'sprite',
    style: '_sprite.scss',
    prefix: 'sprite',
    processor: 'sass',
    engine: 'sprity-gm',
    sort: 'binary-tree',
    format : 'png'
  })
  .pipe($.if('*.png', gulp.dest(appConfig.tmp + 'styles'), gulp.dest(appConfig.tmp + 'styles')))
  .pipe($.if('*.png', gulp.dest(appConfig.theme + 'css'), gulp.dest(appConfig.theme + 'css')));});

//svg
//http://jkphl.github.io/svg-sprite/#gulp
var config = {
  mode: {
    symbol: { 
      bust: false,
      render: {
        scss: {dest: '../_svg-sprite.scss'}
      },
      sprite: '../sprite.svg'
    }
  },
  symbol : true
};

gulp.task('svg-sprites', () => {
  gutil.log(config);
  return gulp.src('**/*.svg', {cwd: appConfig.staticBuild + 'images/svg/'})
    .pipe(svgSprite(config))
    .pipe(gulp.dest(appConfig.tmp + 'styles'));
  });

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src(''+ appConfig.staticBuild +'/**/*.html')
    .pipe($.useref({searchPath: '{'+ appConfig.tmp +','+ appConfig.staticBuild +'}'}))
    // Remove any unused CSS
    .pipe($.if('*.css', $.uncss({
      html: [
        appConfig.tmp +'/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: []
    })))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    appConfig.staticBuild +'/styles/**/*.scss',
    appConfig.staticBuild +'/styles/**/*.css'
  ])
    .pipe($.newer(appConfig.tmp + '/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        appConfig.staticBuild + 'bower_components', 
        appConfig.staticBuild + 'bower_components/support-for/sass', 
        appConfig.tmp + 'styles'],
      errLogToConsole: true,
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(appConfig.tmp + '/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(appConfig.theme + 'css'));
});
// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      appConfig.staticBuild +'/scripts/main.js'
    ])
      .pipe($.newer(appConfig.tmp + '/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(appConfig.tmp + '/scripts'))
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(appConfig.theme + 'js')));