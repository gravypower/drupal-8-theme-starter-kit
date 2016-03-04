'use strict';

import gulp from 'gulp';
import twig from 'gulp-twig';
import data from 'gulp-data';
import path from 'path';
import gutil from 'gulp-util';
import fs from 'fs';
import drupal_twig_filters from './drupal_twig_filters.js'

module.exports = {

	setup: function(appConfig)
	{
		gulp.task('twig', function() {
			return gulp.src([ appConfig.twig + '**/*.twig',"!" + appConfig.twig + 'templates/**/*'])
			.pipe(data(function(file, cb) {
				return getJsonAsync(file.path, cb);}))
			.pipe(twig({filters: drupal_twig_filters.list}))
			.pipe(gulp.dest(appConfig.tmp));
		});
	}
}

function getJsonAsync (p, cb) {
	p = path.dirname(p) + '/data/' + path.basename(p) + '.json';
	fs.stat(p, function (err) {
		if (err) {
			cb(undefined, {});
		} else {
			fs.readFile(p, 'utf8', function (errRead, data) {
				if (errRead) {
					cb(undefined, {});
				} else {
					try {
						var jsData = JSON.parse(data);
						cb(undefined, jsData);
					} catch (ex) {
						gutil.log(gutil.colors.bgRed(ex + " in " + p));
						cb(undefined, {});
					}
				}
		
			})
		}
	})
}