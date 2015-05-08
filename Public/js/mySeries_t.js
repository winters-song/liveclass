
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
    pagingBar:{
      deps: ['jquery']
    },
    vgrid:{
      deps: ['jquery']
    },
    history:{
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
    pagingBar: 'libs/utils/PagingBar'
  }

});

require([
  'jquery',
  'underscore',
	'views/header',
	'views/footer',
  'views/mixins/history',
	'views/teacher/mySeries',
	'common',
  'bootstrap',
  'history'
],function($, _, HeaderView, FooterView, historyUtil, BoardView, Common){

  'use strict';

	Common.initLocale();

  $.extend(Common, historyUtil );

	new HeaderView({
    activeTab : 'mySeries_t'
  });
	new FooterView();

  if(!Common.loginState){
    window.location.href = Common.getLoginUrl();
  }else if(!Common.isTeacher){
    window.location.href = 'lectureRegister.html';
  }

	var boardView = new BoardView();

  var params = [
    'name'
  ];

  Common.initPage(boardView, params);

});
