'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

module.exports = {

	setup: function(appConfig)
	{
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

		// Lint JavaScript
		gulp.task('lint', () =>
		  gulp.src(appConfig.staticBuild + 'scripts/**/*.js')
		    .pipe($.eslint())
		    .pipe($.eslint.format())
		    .pipe($.if(!browserSync.active, $.eslint.failOnError())));
	}
}