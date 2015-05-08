
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

    datetimepicker : {
      deps: ['bootstrap', 'moment']
    },
    select2: {
      deps: ['jquery'],
      exports: '$.fn.select2'
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

    datetimepicker : 'libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
    select2 : 'libs/select2/select2.min'
  }

});

require([
  'jquery',
  'underscore',
	'views/header',
  'views/footer',
  'views/teacher/register',
	'common',
  'bootstrap'
], function($, _, HeaderView, FooterView, RegisterView, Common){

  'use strict';

	Common.initLocale();

  $.extend(Common.api, {
    submitUrl: '/user/registerTeacher',
    schoolUrl: '/user/cio/lists',
    orgUrl: '/user/org/lists',
    emailCheckUrl: '/user/teacher/checkEmail',
    countryUrl: '/user/country/lists',
    collegeUrl: '/University/university'
  });

	new HeaderView();
  new FooterView();

  if(!Common.loginState){
    window.location.href = Common.getLoginUrl();
  }else if(Common.isTeacher){
    window.location.href = 'createClass.html';
  }

  new RegisterView();

});
