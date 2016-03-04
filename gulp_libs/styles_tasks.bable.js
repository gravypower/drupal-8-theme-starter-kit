'use strict';

import svgSprite from 'gulp-svg-sprite';
import sprity from 'sprity';
import gulpLoadPlugins from 'gulp-load-plugins';
import gutil from 'gulp-util';
import gulp from 'gulp';

const $ = gulpLoadPlugins();

module.exports = {

	setup: function(appConfig)
	{
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
	}
}