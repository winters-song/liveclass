
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
    moment: 'libs/utils/moment.min'
  }
});

require([
	'jquery',
	'underscore',
	'views/header',
	'views/footer',
	'common',
	'bootstrap'
],function($, _, HeaderView, FooterView, Common){

  'use strict';

	Common.initLocale();
  
	new HeaderView();
	new FooterView();

  var path = window.location.pathname;

  if(/notes/.test(path)){

  } else if(/complaint/.test(path)){

    if(Common.lang.l == 'cn'){
      $('#content_cn').show();
      $('#content_en').remove();
    }else{
      $('#content_cn').remove();
      $('#content_en').show();
    }
  }

});
