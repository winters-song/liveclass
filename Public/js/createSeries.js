
require.config({
  baseUrl:'./js',

  shim: {
    touchSwipe: {
      deps: ['jquery']
    },
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: '$.fn.popover'
    },
    easing:{
      deps: ['jquery']
    },
    ezpz_hint:{
      deps: ['jquery']
    },
    bootbox: {
      deps: ['bootstrap'],
      exports: 'bootbox'
    },

    'iframe-transport': {
      deps: ['fileupload']
    },
    'fileupload-process': {
      deps: ['fileupload']
    },
    'fileupload-validate': {
      deps: ['fileupload']
    },
    imgareaselect : {
      deps: ['jquery']
    },
    "jquery-ui" : {
      deps: ['jquery']
    },
    datetimepicker : {
      deps: ['bootstrap', 'moment']
    },
    pagingBar:{
      deps: ['jquery']
    },
    vgrid:{
      deps: ['jquery']
    },
    nano: {
      deps: ['jquery']
    }
  },

  paths: {
    touchSwipe: 'libs/jquery/jquery.touchSwipe.min',
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-1.11.0.min',
    underscore: 'libs/underscore/underscore-min',
    cookie: 'libs/jquery/jquery.cookie',
    bootstrap : 'libs/bootstrap/js/bootstrap.min',
    bootbox: 'libs/bootbox/bootbox.min',
    queryString: 'libs/utils/queryString',
    easing: 'libs/jquery/jquery-easing-1.3',
    ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
    moment: 'libs/utils/moment.min',

    history: 'libs/jquery/jquery.history',
    vgrid: 'libs/jquery/jquery.vgrid.min',
    pagingBar: 'libs/utils/PagingBar',

    'jquery.ui.widget' : 'libs/jquery/jquery.ui.widget',
    tmpl: 'libs/blueimp/tmpl.min',
    fileupload: 'libs/blueimp/jquery.fileupload',
    'iframe-transport' : 'libs/blueimp/jquery.iframe-transport',
    'fileupload-process' : 'libs/blueimp/jquery.fileupload-process',
    'fileupload-validate' : 'libs/blueimp/jquery.fileupload-validate',

    "jquery-ui" : "libs/jquery/jquery-ui.min",
    nano: 'libs/jquery/jquery.nano',
    imgareaselect: 'libs/jquery/imgareaselect/scripts/jquery.imgareaselect.min'
  }

});

require([
  'jquery',
  'underscore',
	'views/header',
  'views/footer',
  'views/createSeries/board',
	'common',
  'bootstrap'
], function($, _, HeaderView, FooterView, BoardView, Common){

  'use strict';

	Common.initLocale();

  $.extend(Common, {
    pageType: 'create',
    currentPage: null,
    pageList : {}
  });

	new HeaderView();
  new FooterView();

  if(!Common.loginState){
    window.location.href = Common.getLoginUrl();
  }else if(!Common.isTeacher){
    window.location.href = 'lectureRegister.html';
  }else{
    new BoardView();
  }

});
