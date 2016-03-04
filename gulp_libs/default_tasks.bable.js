'use strict';

import gulp from 'gulp';

module.exports = {

	setup: function(appConfig)
	{
		gulp.task('default', ['clean'], cb =>
		  runSequence(
		    ['sprites', 'svg-sprites', 'styles'],
		    ['lint', 'html', 'scripts', 'images','twig','drupal-copy', 'font-copy', 'image-copy'],
		    cb
	  	));
	  	// Clean output directory
		gulp.task('clean', cb => del([appConfig.tmp], {dot: true}));
	}
}