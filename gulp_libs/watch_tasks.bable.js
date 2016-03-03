'use strict';

import watch from 'gulp-watch';
import gutil from 'gulp-util';

module.exports = {
  setup: function(gulp, appConfig)
  {
    gulp.task('drupal-watch', function() {
      var watchLocation = appConfig.drupal + '**/*';
      watch(watchLocation)
      .on('change', function(ev) {
        gulp.start('drupal-copy');
      })
      .on('unlink', function(ev) {
        var fileToDelete = ('./' + path.relative('./', ev)).replace(appConfig.drupal, appConfig.www);
        del(fileToDelete,  {force: true}).then(paths => {
          gutil.log('deleted: ', paths.join(', '));
        });
      });
    });

    gulp.task('font-watch', function() {
      var watchLocation = appConfig.drupal + 'styles/fonts/**/*'
      gutil.log('watching ' + watchLocation);
      watch(watchLocation)
      .on('change', function(ev) {
        gulp.start('font-copy');
        gutil.log(ev);
      })
     .on('unlink', function(ev) {
        var fileToDelete = ('./' + path.relative('./', ev)).replace(appConfig.drupal, appConfig.www);
        del(fileToDelete,  {force: true}).then(paths => {
          gutil.log('deleted: ', paths.join(', '));
        });
      });
    });

    gulp.task('image-watch', function() {
      var watchLocation = appConfig.drupal + 'styles/images/**/*'
      gutil.log('watching ' + watchLocation);
      watch(watchLocation)
      .on('change', function(ev) {
        gulp.start('font-copy');
        gutil.log(ev);
      })
     .on('unlink', function(ev) {
        var fileToDelete = ('./' + path.relative('./', ev)).replace(appConfig.drupal, appConfig.www);
        del(fileToDelete,  {force: true}).then(paths => {
          gutil.log('deleted: ', paths.join(', '));
        });
      });
    });

    gulp.task('template-watch', function() {
      var watchLocation = appConfig.drupal + 'templates/**/*'
      gutil.log('watching ' + watchLocation);
      watch(watchLocation)
      .on('change', function(ev) {
        gulp.start('template-copy');
        gutil.log(ev);
      })
     .on('unlink', function(ev) {
        var fileToDelete = ('./' + path.relative('./', ev)).replace(appConfig.drupal, appConfig.www);
        del(fileToDelete,  {force: true}).then(paths => {
          gutil.log('deleted: ', paths.join(', '));
        });
      });
    });
  } 
};