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

    'jquery.ui.widget' : 'libs/jquery/jquery.ui.widget',
    tmpl: 'libs/blueimp/tmpl.min',
    fileupload: 'libs/blueimp/jquery.fileupload',
    'iframe-transport' : 'libs/blueimp/jquery.iframe-transport',
    'fileupload-process' : 'libs/blueimp/jquery.fileupload-process',
    'fileupload-validate' : 'libs/blueimp/jquery.fileupload-validate',
    history: 'libs/jquery/jquery.history',
    vgrid: 'libs/jquery/jquery.vgrid.min',
    pagingBar: 'libs/utils/PagingBar'
  },
  findNestedDependencies : true,
  preserveLicenseComments: false,
	name: "myCourseware_t",
 	out: "../built/myCourseware_t.js"
})
