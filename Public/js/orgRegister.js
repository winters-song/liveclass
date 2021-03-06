
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

    iframe_transport:{
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
    
    iframe_transport: 'libs/jquery/jquery.iframe-transport'
  }
});

require([
  'jquery',
  'underscore',
	'views/header',
  'views/footer',
  'views/org/register',
	'common',
  'bootstrap'
], function($, _, HeaderView, FooterView, RegisterView, Common){

  'use strict';

	Common.initLocale();

  $.extend(Common, {
    orgCheckUrl: '/User/org/checkOrg',
    submitUrl: '/User/Org/addOrg'
  });

	new HeaderView();
  new FooterView();
  new RegisterView();

});
