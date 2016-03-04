'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

module.exports = {

	setup: function(appConfig)
	{
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
	}
}