import gutil from 'gulp-util';

module.exports = {

	setup: function(gulp, appConfig)
	{
		gulp.task('drupal-copy', [], () => {  
		  var from = appConfig.drupal + '**/*'
		  var to = appConfig.www;
		  gulp.src(from)
		    .pipe(gulp.dest(to))
		    .on('end', () => {
		      gutil.log('Finshed syncing from ' + from + ' to ' + to);
		    });
		});

		gulp.task('font-copy', [], () => {  
		  var from = appConfig.staticBuild + 'styles/fonts/**/*';
		  var to = appConfig.theme + 'css/fonts/';
		  gulp.src(from)
		    .pipe(gulp.dest(to))
		    .on('end', () => {
		      gutil.log('Finshed syncing from ' + from + ' to ' + to);
		    });
		});

		gulp.task('image-copy', [], () => {  
		  var from = appConfig.staticBuild + 'styles/images/**/*';
		  var to = appConfig.theme + 'css/images/';
		  gulp.src(from)

		    .pipe(gulp.dest(to))
		    .on('end', () => {
		      gutil.log('Finshed syncing from ' + from + ' to ' + to);
		    });
		});

		gulp.task('template-copy', [], () => {  
		  var from = appConfig.twig + 'templates/**/*';
		  var to = appConfig.theme + 'templates/';
		  gulp.src(from)
		    .pipe(gulp.dest(to))
		    .on('end', () => {
		      gutil.log('Finshed syncing from ' + from + ' to ' + to);
		    });
		});
	}
}