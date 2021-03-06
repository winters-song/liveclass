({
  baseUrl:'../js',

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
  },
  findNestedDependencies : true,
  preserveLicenseComments: false,
	name: "lecturerRegister",
 	out: "../built/lecturerRegister.js"
})
