'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

module.exports = {

	setup: function(appConfig)
	{
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
	}
}