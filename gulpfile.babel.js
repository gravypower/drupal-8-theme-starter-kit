'use strict';

//Gulp libs
import watches from './gulp_libs/watch_tasks.bable.js';
import twig from './gulp_libs/twig_tasks.bable.js';
import copy from './gulp_libs/copy_tasks.bable.js';
import default_task from './gulp_libs/default_tasks.bable.js';
import serve from './gulp_libs/serve_tasks.bable.js';
import styles from './gulp_libs/styles_tasks.bable.js';
import scripts from './gulp_libs/scripts_tasks.bable.js';
import html from './gulp_libs/html_tasks.bable.js';

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

watches.setup(appConfig);
twig.setup(appConfig);
copy.setup(appConfig);
default_task.setup(appConfig);
serve.setup(appConfig);
styles.setup(appConfig);
scripts.setup(appConfig);
html.setup(appConfig);